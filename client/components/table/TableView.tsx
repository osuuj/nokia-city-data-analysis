"use client";

import {
	Input,
	Pagination,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import { useEffect, useMemo, useState } from "react";

interface Business {
	business_id: string;
	company_name: string;
	industry_description: string;
	latitude_wgs84: number;
	longitude_wgs84: number;
}

interface TableViewProps {
	data: Business[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
}

export default function TableView({
	data,
	currentPage,
	totalPages,
	onPageChange,
	isLoading,
}: TableViewProps) {
	// ✅ Search, Sort, and Filter State
	const [sortedData, setSortedData] = useState<Business[]>(data);
	const [sortKey, setSortKey] = useState<keyof Business | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [searchTerm, setSearchTerm] = useState("");

	// ✅ Handle Sorting
	useEffect(() => {
		const filteredData = [...data];
		if (sortKey) {
			filteredData.sort((a, b) => {
				if (a[sortKey]! < b[sortKey]!) return sortDirection === "asc" ? -1 : 1;
				if (a[sortKey]! > b[sortKey]!) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
		}
		setSortedData(filteredData);
	}, [data, sortKey, sortDirection]);

	// ✅ Handle Search
	const filteredData = useMemo(() => {
		return sortedData.filter((item) =>
			item.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [sortedData, searchTerm]);

	return (
		<div className="p-4">
			{/* ✅ Search Input */}
			<Input
				className="mb-4"
				placeholder="Search by company name..."
				startContent={<SearchIcon width={16} />}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<Table>
				<TableHeader>
					<TableColumn
						key="company_name"
						onClick={() => setSortKey("company_name")}
					>
						Name
					</TableColumn>
					<TableColumn
						key="business_id"
						onClick={() => setSortKey("business_id")}
					>
						Business ID
					</TableColumn>
					<TableColumn
						key="industry_description"
						onClick={() => setSortKey("industry_description")}
					>
						Industry
					</TableColumn>
					<TableColumn
						key="latitude_wgs84"
						onClick={() => setSortKey("latitude_wgs84")}
					>
						Latitude
					</TableColumn>
					<TableColumn
						key="longitude_wgs84"
						onClick={() => setSortKey("longitude_wgs84")}
					>
						Longitude
					</TableColumn>
				</TableHeader>
				<TableBody
					items={filteredData}
					emptyContent="No results found"
					loadingContent={<Spinner />}
					loadingState={isLoading ? "loading" : "idle"}
				>
					{(item) => (
						<TableRow key={item.business_id}>
							<TableCell>{item.company_name}</TableCell>
							<TableCell>{item.business_id}</TableCell>
							<TableCell>{item.industry_description}</TableCell>
							<TableCell>{item.latitude_wgs84}</TableCell>
							<TableCell>{item.longitude_wgs84}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* ✅ Pagination */}
			<div className="flex justify-center mt-4">
				<Pagination
					showControls
					showShadow
					color="primary"
					page={currentPage}
					total={totalPages}
					onChange={onPageChange}
				/>
			</div>
		</div>
	);
}
