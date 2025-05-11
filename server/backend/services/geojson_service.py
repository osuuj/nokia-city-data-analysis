"""GeoJSON service module.

This module provides services for converting business data to GeoJSON format.
"""

import logging
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

# Configure logger
logger = logging.getLogger(__name__)


def group_businesses_by_id(businesses: List[Any]) -> Dict[str, List[Any]]:
    """Group businesses by their business_id.

    Args:
        businesses: List of business data objects

    Returns:
        Dictionary mapping business_id to list of entries
    """
    grouped: Dict[str, List[Any]] = defaultdict(list)
    for b in businesses:
        grouped[b.business_id].append(b)
    return grouped


def create_feature(business_id: str, entries: List[Any]) -> Optional[Dict[str, Any]]:
    """Create a GeoJSON feature for a business.

    Args:
        business_id: Business identifier
        entries: List of business entries

    Returns:
        GeoJSON Feature object or None if no valid geometry
    """
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
    """Extract address information and coordinates from business entries.

    Args:
        entries: List of business entries

    Returns:
        Tuple containing:
        - Dictionary mapping address types to address information
        - Visiting address coordinates (longitude, latitude) or None
        - Postal address coordinates (longitude, latitude) or None
    """
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
    """Determine the geometry for a GeoJSON feature.

    Args:
        visiting_coords: Tuple of (longitude, latitude) for visiting address
        postal_coords: Tuple of (longitude, latitude) for postal address

    Returns:
        GeoJSON Geometry object or None if no valid coordinates
    """
    if visiting_coords and postal_coords:
        if visiting_coords == postal_coords:
            return {"type": "Point", "coordinates": list(visiting_coords)}
    elif visiting_coords:
        return {"type": "Point", "coordinates": list(visiting_coords)}
    elif postal_coords:
        return {"type": "Point", "coordinates": list(postal_coords)}
    return None


def create_geojson_feature_collection(businesses: List[Any]) -> Dict[str, Any]:
    """Create a GeoJSON FeatureCollection from business data.

    Args:
        businesses: List of business data objects

    Returns:
        GeoJSON FeatureCollection object
    """
    try:
        grouped = group_businesses_by_id(businesses)
        features = [
            create_feature(business_id, entries)
            for business_id, entries in grouped.items()
        ]

        return {
            "type": "FeatureCollection",
            "features": [f for f in features if f],  # Filter out None features
        }
    except Exception as e:
        logger.error(f"Error creating GeoJSON feature collection: {e}")
        raise
