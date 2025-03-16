// 2. useTableFilters.ts
// Main Purpose:
// Handles all filtering logic related to search, worker type, status, and start date.

// Main Parts:

// Manages filter states: filterValue, workerTypeFilter, statusFilter, startDateFilter.
// Implements onSearchChange to update filterValue.
// Provides filtering logic for itemFilter (matching users based on criteria).

const [filterValue, setFilterValue] = useState("");

const [workerTypeFilter, setWorkerTypeFilter] = React.useState("all");
const [statusFilter, setStatusFilter] = React.useState("all");
const [startDateFilter, setStartDateFilter] = React.useState("all");

const itemFilter = useCallback(
        (col: Users) => {
            const allWorkerType = workerTypeFilter === "all";
            const allStatus = statusFilter === "all";
            const allStartDate = startDateFilter === "all";

            return (
                (allWorkerType || workerTypeFilter === col.workerType.toLowerCase()) &&
                (allStatus || statusFilter === col.status.toLowerCase()) &&
                (allStartDate ||
                    new Date(
                        new Date().getTime() -
                            +(startDateFilter.match(/(\d+)(?=Days)/)?.[0] ?? 0) *
                                24 *
                                60 *
                                60 *
                                1000,
                    ) <= new Date(col.startDate))
            );
        },
        [startDateFilter, statusFilter, workerTypeFilter],
    );

    const filteredItems = useMemo(() => {
            let filteredUsers = [...users];
    
            if (filterValue) {
                filteredUsers = filteredUsers.filter((user) =>
                    user.memberInfo.name.toLowerCase().includes(filterValue.toLowerCase()),
                );
            }
    
            filteredUsers = filteredUsers.filter(itemFilter);
    
            return filteredUsers;
        }, [filterValue, itemFilter]);
    
 const onSearchChange = useMemoizedCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    });       