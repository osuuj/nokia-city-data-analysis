// 2. TableHeaderComponent.tsx
// Main Purpose:
// Manages and renders the table headers, handling sorting interactions.

// Main Parts:

// Loops through headerColumns to render column headers.
// Handles sorting interactions (handleMemberClick for sorting memberInfo).
// Uses ArrowUpIcon and ArrowDownIcon to indicate sorting order.
// Displays tooltips for column descriptions if needed.

const topBar = useMemo(() => {
		return (
			<div className="mb-[18px] flex items-center justify-between">
				<div className="flex w-[226px] items-center gap-2">
					<h1 className="text-2xl font-[700] leading-[32px]">Team Members</h1>
					<Chip
						className="hidden items-center text-default-500 sm:flex"
						size="sm"
						variant="flat"
					>
						{users.length}
					</Chip>
				</div>
				<Button
					color="primary"
					endContent={<Icon icon="solar:add-circle-bold" width={20} />}
				>
					Add Member
				</Button>
			</div>
		);
	}, []);