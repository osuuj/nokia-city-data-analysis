# Dashboard API Documentation

## Overview

This document provides comprehensive documentation for the API endpoints and data structures used in the Dashboard feature. The Dashboard feature interacts with several backend services to fetch and process data for analytics, filtering, and visualization.

## API Endpoints

### Cities API

#### `GET /api/cities`

Retrieves a list of all cities available in the system.

**Response:**
```typescript
interface CitiesResponse {
  data: City[];
  status: number;
  message: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
}
```

### Analytics API

#### `GET /api/analytics/top-cities`

Retrieves the top cities based on selected criteria.

**Query Parameters:**
- `industries` (optional): Comma-separated list of industry IDs to filter by
- `limit` (optional): Maximum number of cities to return (default: 10)

**Response:**
```typescript
interface TopCitiesResponse {
  data: TopCityData[];
  status: number;
  message: string;
}

interface TopCityData {
  city: string;
  count: number;
  percentage: number;
  industries: {
    [industryId: string]: number;
  };
}
```

#### `GET /api/analytics/industry-distribution`

Retrieves the distribution of industries across selected cities.

**Query Parameters:**
- `cities` (optional): Comma-separated list of city IDs to filter by
- `industries` (optional): Comma-separated list of industry IDs to filter by

**Response:**
```typescript
interface IndustryDistributionResponse {
  data: DistributionItemRaw[];
  status: number;
  message: string;
}

interface DistributionItemRaw {
  name: string;
  value: number;
}
```

#### `GET /api/analytics/industries-by-city`

Retrieves the distribution of industries by city.

**Query Parameters:**
- `cities` (optional): Comma-separated list of city IDs to filter by
- `industries` (optional): Comma-separated list of industry IDs to filter by

**Response:**
```typescript
interface IndustriesByCityResponse {
  data: PivotedData;
  status: number;
  message: string;
}

interface PivotedData {
  cities: string[];
  industries: string[];
  data: {
    [city: string]: {
      [industry: string]: number;
    };
  };
}
```

#### `GET /api/analytics/city-comparison`

Retrieves data for comparing cities.

**Query Parameters:**
- `cities` (optional): Comma-separated list of city IDs to filter by
- `industries` (optional): Comma-separated list of industry IDs to filter by

**Response:**
```typescript
interface CityComparisonResponse {
  data: PivotedData;
  status: number;
  message: string;
}
```

### Companies API

#### `GET /api/companies`

Retrieves a list of companies with optional filtering.

**Query Parameters:**
- `cities` (optional): Comma-separated list of city IDs to filter by
- `industries` (optional): Comma-separated list of industry IDs to filter by
- `search` (optional): Search term to filter companies by name
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sort` (optional): Field to sort by (e.g., "name", "city")
- `order` (optional): Sort order ("asc" or "desc")

**Response:**
```typescript
interface CompaniesResponse {
  data: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status: number;
  message: string;
}

interface Company {
  id: string;
  name: string;
  city: string;
  industry: string;
  size?: string;
  founded?: number;
  website?: string;
  description?: string;
}
```

## Data Transformation

The dashboard feature includes several data transformation utilities to convert raw API responses into formats suitable for visualization:

### `transformIndustriesByCity`

Transforms the raw pivoted data from the industries-by-city API into a format suitable for visualization.

```typescript
function transformIndustriesByCity(data: PivotedData): TransformedIndustriesByCity[]
```

### `transformCityComparison`

Transforms the raw pivoted data from the city-comparison API into a format suitable for visualization.

```typescript
function transformCityComparison(data: PivotedData): TransformedCityComparison[]
```

### `transformDistribution`

Transforms the raw distribution data into a format suitable for visualization.

```typescript
function transformDistribution(data: DistributionItemRaw[]): TransformedDistribution[]
```

## Error Handling

All API requests are wrapped with error handling to provide consistent error messages and fallback UI:

```typescript
interface ErrorWithApi {
  name: string;
  message: string;
  status?: number;
  code?: string;
}
```

## Authentication

API requests require authentication using a JWT token. The token is automatically included in the request headers by the `apiClient` utility.

## Rate Limiting

API requests are subject to rate limiting. The dashboard feature implements retry logic with exponential backoff for failed requests.

## Caching

API responses are cached using React Query to improve performance and reduce server load. Cache invalidation is handled automatically based on query keys. 