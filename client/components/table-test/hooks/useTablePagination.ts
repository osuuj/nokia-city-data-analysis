// 3. useTablePagination.ts
// Main Purpose:
// Handles pagination logic to navigate between pages.

// Main Parts:

// Tracks page, rowsPerPage, and total pages.
// Provides onNextPage and onPreviousPage functions.
// Ensures correct slicing of data for current page.

const [rowsPerPage] = useState(10);
const [page, setPage] = useState(1);

const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;
    
        const items = useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
    
            return filteredItems.slice(start, end);
        }, [page, filteredItems, rowsPerPage]);

const onNextPage = useMemoizedCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    });

    const onPreviousPage = useMemoizedCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    });