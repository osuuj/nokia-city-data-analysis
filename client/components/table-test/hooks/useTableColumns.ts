// 1. useTableColumns.ts
// Main Purpose:
// Manages visible columns and sorting-related logic.

// Main Parts:

// Tracks headerColumns based on visibility settings.
// Filters visible columns dynamically.
// Ensures the sorting column updates when needed.

const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );


    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns
            .map((item) => {
                if (item.uid === sortDescriptor.column) {
                    return {
                        ...item,
                        sortDirection: sortDescriptor.direction,
                    };
                }

                return item;
            })
            .filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns, sortDescriptor]);