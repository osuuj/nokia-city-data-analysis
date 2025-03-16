// 5. useTableSelection.ts
// Main Purpose:
// Handles selection logic for table rows.

// Main Parts:

// Manages selectedKeys state.
// Implements onSelectionChange for selecting/deselecting rows.
// Provides filterSelectedKeys to track selected items when filtering is applied.


const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));


	const filterSelectedKeys = useMemo(() => {
		if (selectedKeys === "all") return selectedKeys;
		let resultKeys = new Set<Key>();

		if (filterValue) {
			filteredItems.forEach((item) => {
				const stringId = String(item.id);

				if ((selectedKeys as Set<string>).has(stringId)) {
					resultKeys.add(stringId);
				}
			});
		} else {
			resultKeys = selectedKeys;
		}

		return resultKeys;
	}, [selectedKeys, filteredItems, filterValue]);

	const onSelectionChange = useMemoizedCallback((keys: Selection) => {
		if (keys === "all") {
			if (filterValue) {
				const resultKeys = new Set(
					filteredItems.map((item) => String(item.id)),
				);

				setSelectedKeys(resultKeys);
			} else {
				setSelectedKeys(keys);
			}
		} else if (keys.size === 0) {
			setSelectedKeys(new Set());
		} else {
			const resultKeys = new Set<Key>();

			keys.forEach((v) => {
				resultKeys.add(v);
			});
			const selectedValue =
				selectedKeys === "all"
					? new Set(filteredItems.map((item) => String(item.id)))
					: selectedKeys;

			selectedValue.forEach((v) => {
				if (items.some((item) => String(item.id) === v)) {
					return;
				}
				resultKeys.add(v);
			});
			setSelectedKeys(new Set(resultKeys));
		}
	});