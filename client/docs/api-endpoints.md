# API Endpoints Documentation

This document outlines the API endpoints used in the Nokia City Data Analysis app.

## Base URL

The base URL for all API endpoints is determined by:

- Production: `https://api.osuuj.ai`
- Development: `http://localhost:8000`

All endpoints are prefixed with `/api/v1`.

## Companies Endpoints

| Endpoint | Description | Parameters | Response |
|----------|-------------|------------|----------|
| `GET /companies.geojson` | Retrieve GeoJSON data for companies | `city` (required) - city name | GeoJSON FeatureCollection of company points |
| `GET /cities` | Get list of available cities | None | Array of city names |
| `GET /companies/businesses_by_city` | Get businesses in a city | `city` (required) - city name | Array of business data |
| `GET /companies/businesses_by_industry` | Get businesses by industry | `industry_letter` (required), `city` (optional), `limit` (optional, default 100) | Array of business data |
| `GET /companies/industries` | Get list of available industries | None | Array of industry names |

## Analytics Endpoints

| Endpoint | Description | Parameters | Response |
|----------|-------------|------------|----------|
| `GET /analytics/industry-distribution` | Get industry distribution | `cities` (optional) - comma-separated list or single city | Array of industry distribution data |
| `GET /analytics/industry_comparison_by_cities` | Compare industries between cities | `city1` (required), `city2` (required) | Array of industry comparison data |
| `GET /analytics/company_growth` | Get company growth over time | `city` (required) - city name | Array of year-by-year growth data |
| `GET /analytics/top-cities` | Get top cities by company count | None | Array of city ranking data |
| `GET /analytics/city-comparison` | Compare multiple cities | `cities` (required) - comma-separated list | Comparison data between cities |
| `GET /analytics/industries-by-city` | Get industries by city | `cities` (required) - comma-separated list or single city | Array of industry data by city |

## Response Formats

### Companies GeoJSON

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [24.9384, 60.1699] // [longitude, latitude]
      },
      "properties": {
        "business_id": "1234567-8",
        "company_name": "Example Company Ltd",
        "industry": "Software Development",
        "industry_letter": "J",
        // Additional properties as available
      }
    }
    // More features...
  ]
}
```

### Business Data

```json
[
  {
    "business_id": "1234567-8",
    "company_name": "Example Company Ltd",
    "company_type": "Limited Company",
    "street": "Example Street",
    "building_number": "123",
    "entrance": "A",
    "postal_code": "00100",
    "city": "Helsinki",
    "latitude_wgs84": "60.1699",
    "longitude_wgs84": "24.9384",
    "address_type": "Visiting address",
    "active": "true",
    "industry_description": "Software Development",
    "industry_letter": "J",
    "industry": "Information and Communication",
    "registration_date": "2000-01-01",
    "website": "https://example.com"
  }
  // More businesses...
]
```

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses include a JSON body with:

```json
{
  "detail": "Error message describing the issue"
}
``` 