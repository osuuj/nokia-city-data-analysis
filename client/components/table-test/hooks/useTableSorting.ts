// 4. useTableSorting.ts
// Main Purpose:
// Manages sorting logic for the table.

// Main Parts:

// Tracks sortDescriptor state (column and direction).
// Implements handleMemberClick to toggle sorting.
// Provides setSortDescriptor for column sorting updates.


const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "memberInfo",
        direction: "ascending",
    });


    const sortedItems = useMemo(() => {
        return [...items].sort((a: Users, b: Users) => {
            const col = sortDescriptor.column as keyof Users;

            let first = a[col];
            let second = b[col];

            if (col === "memberInfo" || col === "country") {
                first = a[col].name;
                second = b[col].name;
            } else if (sortDescriptor.column === "externalWorkerID") {
                first = +a.externalWorkerID.split("EXT-")[1];
                second = +b.externalWorkerID.split("EXT-")[1];
            }

            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);
