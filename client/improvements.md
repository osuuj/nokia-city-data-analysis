🔹 Step-by-Step Plan for Refactoring Your Project
We will move slowly and systematically, ensuring that each step works before moving to the next one. The goal is to gradually improve efficiency, maintainability, and scalability.

🟢 Step 1: Modify the Header to Use React Query for City Search
What We Change:
Remove direct URL updates (router.push) from HomeHeader.tsx.
Use React Query to fetch cities dynamically instead of using SWR.
Store the selected city in React Context instead of the URL.
How We Test This:
✅ Ensure city list loads correctly in the search dropdown.
✅ Ensure selecting a city updates the state but does NOT yet affect the table.
✅ Ensure console logs confirm that the state is updating.

🟢 Step 2: Modify page.tsx to Fetch Companies via React Query
What We Change:
Replace Zustand's useCompanies() hook with React Query (useQuery).
Ensure the page listens to the city selection from React Context instead of URL parameters.
Remove duplicate state management (like storing companies twice in different states).
How We Test This:
✅ Selecting a city should trigger an API request for companies.
✅ Ensure the API call is paginated so it doesn't fetch all companies at once.
✅ Ensure console logs show fetched company data correctly.
✅ No table implementation yet—we just verify the data fetching works.

🟢 Step 3: Modify Component Structure to Optimize Data Flow
What We Change:
Introduce a new parent holder component for the table & map.
Ensure state management is centralized:
Move selected companies to a React Context.
Move filtering, sorting, pagination logic to separate reusable hooks.
Optimize data passing between page.tsx, Table.tsx, and MapView.tsx.
How We Test This:
✅ Ensure selected city is available in the parent component.
✅ Ensure the parent can pass companies data down to the table.
✅ No UI changes yet—just verifying the structure is correct.

🟢 Step 4: Connect the Table to the API Data
What We Change:
Modify Table.tsx to accept external data instead of using local mock data.
Ensure columns are generated dynamically instead of hardcoding them.
Handle loading states and API errors.
How We Test This:
✅ Ensure table renders companies when a city is selected.
✅ Ensure columns adjust dynamically based on API response.
✅ Ensure pagination is controlled by backend requests.

🟢 Step 5: Ensure Table Selections Are Synced with the Map
What We Change:
Move selected company rows to React Context.
Ensure MapView.tsx reads the selected companies from shared state.
Clicking a row in the table highlights the company on the map.
How We Test This:
✅ Selecting a company in the table should update the map.
✅ Clicking a marker in the map should highlight the table row.
✅ Removing a selection should remove the marker.

🟢 Step 6: Final Refinements & Error Handling
What We Change:
Ensure filters, sorting, and pagination work seamlessly.
Add error handling & retry logic for API failures.
Optimize performance by reducing unnecessary re-renders.
How We Test This:
✅ Test edge cases (e.g., empty search results, network failures).
✅ Ensure no unnecessary re-renders when selecting/deselecting rows.
✅ Optimize API requests (e.g., avoid fetching when data is unchanged).

🔹 Why This Plan Works
✅ We modify one component at a time and test before moving forward.
✅ We prioritize structure first, ensuring that components are modular and efficient.
✅ We avoid unnecessary complexity upfront, keeping each step small and manageable.
✅ We continuously verify functionality, reducing the risk of breaking changes.