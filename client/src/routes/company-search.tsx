import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { fetchCompanies } from '../api/companies'
import { Company } from '../api/companies'

const companySearchSchema = z.object({
  city: z.string().catch('Turku'),
})

export type CompanySearch = z.infer<typeof companySearchSchema>

export const Route = createFileRoute('/company-search')({
  validateSearch: zodValidator(companySearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => fetchCompanies(deps as CompanySearch),
  component: Companies,
})

function Companies() {
  const companies = Route.useLoaderData()

  console.log('companies:', companies);

  // Render the companies
  return (
    <div>
      <h1>Companies</h1>
      <ul>
        {companies.map((company: Company) => (
          <li key={company.business_id}>{company.business_id} --- {company.company_name}</li>
        ))}
      </ul>
    </div>
  )
}
