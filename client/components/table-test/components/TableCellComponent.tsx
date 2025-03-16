// 5. TableCellComponent.tsx
// Main Purpose:
// Handles the rendering of different column types (text, status, icons, etc.).

// Main Parts:

// Uses switch statements to determine how to render each column.
// Displays CopyText for workerID and externalWorkerID.
// Uses UserCard for memberInfo.
// Displays IconWithLabel for startDate and country.
// Uses ChipList for teams.
// Uses StatusBadge for status.
// Renders action buttons (EyeFilledIcon, EditLinearIcon, DeleteFilledIcon).

const renderCell = useMemoizedCallback(
		(user: Users, columnKey: React.Key) => {
			const userKey = columnKey as ColumnsKey;

			const cellValue = user[userKey as unknown as keyof Users] as string;

			switch (userKey) {
				case "workerID":
				case "externalWorkerID":
					return <CopyText>{cellValue}</CopyText>;
				case "memberInfo":
					return (
						<User
							avatarProps={{ radius: "lg", src: user[userKey].avatar }}
							classNames={{
								name: "text-default-foreground",
								description: "text-default-500",
							}}
							description={user[userKey].email}
							name={user[userKey].name}
						>
							{user[userKey].email}
						</User>
					);
				case "startDate":
					return (
						<div className="flex items-center gap-1">
							<Icon
								className="h-[16px] w-[16px] text-default-300"
								icon="solar:calendar-minimalistic-linear"
							/>
							<p className="text-nowrap text-small capitalize text-default-foreground">
								{new Intl.DateTimeFormat("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								}).format(cellValue as unknown as Date)}
							</p>
						</div>
					);
				case "country":
					return (
						<div className="flex items-center gap-2">
							<div className="h-[16px] w-[16px]">{user[userKey].icon}</div>
							<p className="text-nowrap text-small text-default-foreground">
								{user[userKey].name}
							</p>
						</div>
					);
				case "teams":
					return (
						<div className="float-start flex gap-1">
							{user[userKey].map((team, index) => {
								if (index < 3) {
									return (
										<Chip
											key={team}
											className="rounded-xl bg-default-100 px-[6px] capitalize text-default-800"
											size="sm"
											variant="flat"
										>
											{team}
										</Chip>
									);
								}
								if (index < 4) {
									return (
										<Chip
											key={team}
											className="text-default-500"
											size="sm"
											variant="flat"
										>
											{`+${team.length - 3}`}
										</Chip>
									);
								}

								return null;
							})}
						</div>
					);
				case "role":
					return (
						<div className="text-nowrap text-small capitalize text-default-foreground">
							{cellValue}
						</div>
					);
				case "workerType":
					return <div className="text-default-foreground">{cellValue}</div>;
				case "status":
					return <Status status={cellValue as StatusOptions} />;
				case "actions":
					return (
						<div className="flex items-center justify-end gap-2">
							<EyeFilledIcon
								{...getEyesProps()}
								className="cursor-pointer text-default-400"
								height={18}
								width={18}
							/>
							<EditLinearIcon
								{...getEditProps()}
								className="cursor-pointer text-default-400"
								height={18}
								width={18}
							/>
							<DeleteFilledIcon
								{...getDeleteProps()}
								className="cursor-pointer text-default-400"
								height={18}
								width={18}
							/>
						</div>
					);
				default:
					return cellValue;
			}
		},
	);