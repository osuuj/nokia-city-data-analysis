- black flashing in light theme in Resource and Project pages
- check aws everything
- solve github actions and vercel
- vercel configs
- understand vercel preview and production(some difference so that must go production how exactly data fetching works)

-white flashes when loading page?
- I see shortly loading logo when navigating back to landing page



Comparison: nokia/client vs. client Data Fetching Approaches
After examining both the nokia/client and client directories, I can confirm they implement nearly identical data fetching strategies with only minor refinements in the main client directory. Here's the comparison:
1. Architecture Evolution
Both use a similar high-level architecture with centralized API client and hooks
Root client: Has a more organized structure with specialized query hooks broken into separate files
Key improvement: Root client implements a dedicated query hooks directory structure to better organize data fetching logic
2. Query Key Management
Root client: Introduces query-keys.ts - a centralized query key management system that:
Enables more granular cache invalidation
Provides type safety for query keys
Makes refactoring easier with keys in one place
Nokia client: Uses inline query keys without a centralized system
3. API Endpoint Organization
Root client: Added api-endpoints.ts that centralizes all API endpoints as constants
Apply to NOKIA_DATA_F...
Nokia client: Has endpoints hardcoded in the API utility functions
4. Hook Organization
Root client: Query hooks are modularized:
Apply to NOKIA_DATA_F...
Nokia client: Combines query functionality in fewer files
5. Backward Compatibility
Root client: Maintains backward compatibility for components still using older patterns:
Apply to NOKIA_DATA_F...
6. Data Transformation
Root client: Cleaner separation between data fetching and transformation:
Apply to NOKIA_DATA_F...
7. Enhanced Error Handling
Both have similar error handling approaches with:
Typed error categories
Retry mechanisms
Error transformation
8. Performance Optimizations
Root client: Added performance improvements:
Apply to NOKIA_DATA_F...
9. API Abstractions
Both use React Query with similar configuration options
Both set sensible defaults for stale time, retries, and caching
10. Unified Query Configuration
Root client: Better default configurations with more consistent retry strategies
Reusable query options across similar endpoints
Key Insight
The primary difference is that the root client directory implements a more sophisticated organization of the data fetching code with:
Better separation of concerns
More modular file structure
Centralized configuration for query keys and API endpoints
Same core fetching mechanism but more organized
This approach makes the codebase more maintainable and scalable while preserving the same core data fetching functionality found in the nokia/client implementation.






