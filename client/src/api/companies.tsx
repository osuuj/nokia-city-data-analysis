import { notFound } from '@tanstack/react-router'
import axios from 'redaxios'
import { CompanySearch } from '../routes/company-search';

export type Company = {
    business_id: string;            // Business ID
    company_name: string;           // Company name
    website?: string;               // Website URL
    company_id_status?: string;     // Status of the company
    trade_register_status?: string; // Trade register status
    registration_date?: Date;       // Date of registration
    end_date?: Date;                // End date of the company
    last_modified?: Date;           // Last modified date
};

export const fetchCompany = async (businessId: string) => {
    console.info(`Fetching company with business_id ${businessId}...`)
    const company = await axios
        .get<Company>(`http://localhost:8000/api/v1/companies/${businessId}`)
        .then((res) => res.data)
        .catch((err) => {
            if (err.status === 404) {
                throw notFound()
            }
            throw err
        })

    return company
}

export const fetchCompanies = async (searchParams: CompanySearch) => {
    console.info('Fetching companies with search parameters...', searchParams);

    const { city } = searchParams;

    const response = await axios.get<Array<Company>>('http://localhost:8000/api/v1/businesses_by_city', {
        params: {
            city,
        },
    });

    return response.data;
};