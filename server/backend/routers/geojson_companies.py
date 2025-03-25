from typing import Any, Dict

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
    """Return business data as a GeoJSON FeatureCollection."""
    businesses = get_business_data_by_city(db, city)

    features = []
    for b in businesses:
        # Skip if location is missing
        if not b.longitude_wgs84 or not b.latitude_wgs84:
            continue

        try:
            longitude = float(b.longitude_wgs84)
            latitude = float(b.latitude_wgs84)
        except ValueError:
            continue

        feature = {
            "type": "Feature",
            "properties": {
                "business_id": b.business_id,
                "company_name": b.company_name,
                "company_type": b.company_type,
                "industry_letter": b.industry_letter,
                "industry": b.industry,
                "industry_description": b.industry_description,
                "street": b.street,
                "building_number": b.ilding_number,
                "entrance": b.entrance,
                "address_type": b.address_type,
                "website": b.website,
                "city": b.city,
                "postal_code": b.postal_code,
                "active": b.active,
                "registration_date": b.registration_date,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude],
            },
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features,
    }
