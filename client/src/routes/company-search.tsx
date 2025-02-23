import { useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { fetchCompanies } from '../api/companies';
import { Company } from '../api/companies';
import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';

const companySearchSchema = z.object({
  city: z.string().catch(''),
})

export type CompanySearch = z.infer<typeof companySearchSchema>

export const Route = createFileRoute('/company-search')({
  validateSearch: zodValidator(companySearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => fetchCompanies(deps as CompanySearch),
  component: Companies,
})

function Companies() {
  const companies = Route.useLoaderData();
  const cityRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate({ from: '/company-search' })

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const city = cityRef.current?.value || '';
    navigate({ to: '/company-search', search: { city } });
  };

  return (
    <div>
      <h1>Search by City</h1>
      <form onSubmit={handleSearch}>
        <label>
          City:{' '}
          <input
            type="text"
            ref={cityRef}
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
      <ul>
        {companies.map((company: Company) => (
          <li key={company.business_id}>
            {company.business_id} --- {company.company_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
