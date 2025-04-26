import { ApiError } from '@/features/api';
import { NextRequest } from 'next/server';
import { GET, POST } from '../companies/route';

// Define the Company interface
interface Company {
  id: string;
  name: string;
  industry: string;
  city: string;
  address: string;
  postalCode: string;
  website: string;
  active: boolean;
}

describe('Companies API', () => {
  describe('GET handler', () => {
    it('should return a list of companies', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/companies');

      // Call the GET handler
      const response = await GET(request);

      // Parse the response
      const data = await response.json();

      // Check the response structure
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.message).toBe('Companies retrieved successfully');

      // Check the data structure
      const companies = data.data;
      expect(companies.length).toBeGreaterThan(0);
      expect(companies[0]).toHaveProperty('id');
      expect(companies[0]).toHaveProperty('name');
      expect(companies[0]).toHaveProperty('industry');
      expect(companies[0]).toHaveProperty('city');
      expect(companies[0]).toHaveProperty('address');
      expect(companies[0]).toHaveProperty('postalCode');
      expect(companies[0]).toHaveProperty('website');
      expect(companies[0]).toHaveProperty('active');
    });

    it('should filter companies by city', async () => {
      // Create a mock request with city filter
      const request = new NextRequest('http://localhost:3000/api/companies?city=Nokia');

      // Call the GET handler
      const response = await GET(request);

      // Parse the response
      const data = await response.json();

      // Check the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);

      // Check that all companies are in Nokia
      const companies = data.data as Company[];
      for (const company of companies) {
        expect(company.city).toBe('Nokia');
      }
    });

    it('should filter companies by industry', async () => {
      // Create a mock request with industry filter
      const request = new NextRequest('http://localhost:3000/api/companies?industry=Technology');

      // Call the GET handler
      const response = await GET(request);

      // Parse the response
      const data = await response.json();

      // Check the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);

      // Check that all companies are in the Technology industry
      const companies = data.data as Company[];
      for (const company of companies) {
        expect(company.industry).toBe('Technology');
      }
    });

    it('should handle pagination', async () => {
      // Create a mock request with pagination
      const request = new NextRequest('http://localhost:3000/api/companies?page=1&limit=2');

      // Call the GET handler
      const response = await GET(request);

      // Parse the response
      const data = await response.json();

      // Check the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeLessThanOrEqual(2);
    });

    it('should validate pagination parameters', async () => {
      // Create a mock request with invalid pagination
      const request = new NextRequest('http://localhost:3000/api/companies?page=0&limit=0');

      // Call the GET handler
      const response = await GET(request);

      // Parse the response
      const data = await response.json();

      // Check the error response
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      // Create a mock request that will cause an error
      const request = new NextRequest('http://localhost:3000/api/companies?error=true');

      // Mock the console.error to prevent test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Call the GET handler
      const response = await GET(request);

      // Restore console.error
      consoleSpy.mockRestore();

      // Parse the response
      const data = await response.json();

      // Check the error response structure
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST handler', () => {
    it('should create a new company', async () => {
      // Create a mock request with company data
      const companyData = {
        name: 'Test Company',
        industry: 'Technology',
        city: 'Nokia',
        address: 'Test Address',
        postalCode: '37100',
        website: 'https://testcompany.fi',
      };

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      // Call the POST handler
      const response = await POST(request);

      // Parse the response
      const data = await response.json();

      // Check the response
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Company created successfully');

      // Check the created company
      const company = data.data as Company;
      expect(company.id).toBeDefined();
      expect(company.name).toBe(companyData.name);
      expect(company.industry).toBe(companyData.industry);
      expect(company.city).toBe(companyData.city);
      expect(company.address).toBe(companyData.address);
      expect(company.postalCode).toBe(companyData.postalCode);
      expect(company.website).toBe(companyData.website);
      expect(company.active).toBe(true);
    });

    it('should validate required fields', async () => {
      // Create a mock request with missing required fields
      const companyData = {
        name: 'Test Company',
        // Missing industry and city
      };

      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      // Call the POST handler
      const response = await POST(request);

      // Parse the response
      const data = await response.json();

      // Check the error response
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      // Create a mock request that will cause an error
      const request = new NextRequest('http://localhost:3000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      // Mock the console.error to prevent test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Call the POST handler
      const response = await POST(request);

      // Restore console.error
      consoleSpy.mockRestore();

      // Parse the response
      const data = await response.json();

      // Check the error response structure
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });
});
