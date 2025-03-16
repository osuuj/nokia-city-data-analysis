export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

export interface TableColumn {
  key: keyof Business; // ✅ Key must be a valid Business field
  label: string; // ✅ Custom label for display
}

export interface TableViewProps {
  data: Business[];
  columns: TableColumn[]; // ✅ Ensures columns have both key & label
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}