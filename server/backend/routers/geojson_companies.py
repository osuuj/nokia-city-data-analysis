from collections import defaultdict
from typing import Any, Dict, List

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

    grouped: Dict[str, List[Any]] = defaultdict(list)
    for b in businesses:
        grouped[b.business_id].append(b)

    features = []

    for business_id, entries in grouped.items():
        address_map = {}
        coordinates = None

        # Track which address types we have
        for entry in entries:
            # Skip invalid coordinates
            try:
                lng = float(entry.longitude_wgs84)
                lat = float(entry.latitude_wgs84)
            except (TypeError, ValueError):
                continue

            address_type = entry.address_type or "Unknown"

            address_map[address_type] = {
                "street": entry.street,
                "building_number": entry.building_number,
                "entrance": entry.entrance,
                "postal_code": entry.postal_code,
                "city": entry.city,
                "longitude": lng,
                "latitude": lat,
            }

            # Prefer Visiting address for marker placement
            if address_type == "Visiting address":
                coordinates = [lng, lat]

        # Fallback: use Postal address coords if no Visiting one
        if not coordinates and "Postal address" in address_map:
            coordinates = [
                address_map["Postal address"]["longitude"],
                address_map["Postal address"]["latitude"],
            ]

        # Still nothing? Skip
        if not coordinates:
            continue

        # Use first entry to copy general info
        base = entries[0]

        feature = {
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
                "addresses": address_map,  # 💡 All address types here
            },
            "geometry": {
                "type": "Point",
                "coordinates": coordinates,
            },
        }

        features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features,
    }
