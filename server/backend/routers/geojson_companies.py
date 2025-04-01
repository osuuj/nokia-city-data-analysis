from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.backend.database import get_db
from server.backend.services.company_service import get_business_data_by_city

router = APIRouter()


@router.get("/companies.geojson", response_model=Dict[str, Any])
def get_companies_geojson(
    city: str = Query(..., description="City name to filter by"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Return grouped business data as a GeoJSON FeatureCollection."""
    businesses = get_business_data_by_city(db, city)

    grouped = group_businesses_by_id(businesses)
    features = [
        create_feature(business_id, entries) for business_id, entries in grouped.items()
    ]

    return {
        "type": "FeatureCollection",
        "features": [f for f in features if f],  # Filter out None features
    }


def group_businesses_by_id(businesses: List[Any]) -> Dict[str, List[Any]]:
    """Group businesses by their business_id."""
    grouped: Dict[str, List[Any]] = defaultdict(list)
    for b in businesses:
        grouped[b.business_id].append(b)
    return grouped


def create_feature(business_id: str, entries: List[Any]) -> Optional[Dict[str, Any]]:
    """Create a GeoJSON feature for a business."""
    address_map, visiting_coords, postal_coords = extract_addresses(entries)
    geometry = determine_geometry(visiting_coords, postal_coords)

    # Skip if no valid geometry
    if not geometry and not (visiting_coords or postal_coords):
        return None

    base = entries[0]
    return {
        "type": "Feature",
        "properties": {
            "business_id": business_id,
            "company_name": base.company_name,
            "company_type": base.company_type,
            "industry_letter": base.industry_letter,
            "industry": base.industry,
            "industry_description": base.industry_description,
            "website": base.website,
            "active": base.active,
            "registration_date": base.registration_date,
            "addresses": address_map,
        },
        "geometry": geometry,
    }


def extract_addresses(
    entries: List[Any],
) -> Tuple[
    Dict[str, Dict[str, Any]],
    Optional[Tuple[float, float]],
    Optional[Tuple[float, float]],
]:
    """Extract address information and coordinates from business entries."""
    address_map = {}
    visiting_coords = None
    postal_coords = None

    for entry in entries:
        try:
            lng = float(entry.longitude_wgs84)
            lat = float(entry.latitude_wgs84)
        except (TypeError, ValueError):
            continue

        addr = {
            "street": entry.street,
            "building_number": entry.building_number,
            "entrance": entry.entrance,
            "postal_code": entry.postal_code,
            "city": entry.city,
            "longitude": lng,
            "latitude": lat,
        }

        address_type = entry.address_type or "Unknown"
        address_map[address_type] = addr

        if address_type == "Visiting address":
            visiting_coords = (lng, lat)
        elif address_type == "Postal address":
            postal_coords = (lng, lat)

    return address_map, visiting_coords, postal_coords


def determine_geometry(
    visiting_coords: Optional[Tuple[float, float]],
    postal_coords: Optional[Tuple[float, float]],
) -> Optional[Dict[str, Any]]:
    """Determine the geometry for a GeoJSON feature."""
    if visiting_coords and postal_coords:
        if visiting_coords == postal_coords:
            return {"type": "Point", "coordinates": list(visiting_coords)}
    elif visiting_coords:
        return {"type": "Point", "coordinates": list(visiting_coords)}
    elif postal_coords:
        return {"type": "Point", "coordinates": list(postal_coords)}
    return None
