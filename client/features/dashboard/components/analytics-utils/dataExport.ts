/**
 * Utility functions for exporting data in various formats
 * @module dataExport
 */

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    label?: string;
  }>;
}

/**
 * Converts an array of objects to CSV format
 * @param data - Array of objects to convert to CSV
 * @param headers - Optional mapping of object keys to CSV headers
 * @returns CSV string
 * @example
 * ```ts
 * const data = [
 *   { id: 1, name: 'John', age: 30 },
 *   { id: 2, name: 'Jane', age: 25 }
 * ];
 * const headers = { id: 'ID', name: 'Name', age: 'Age' };
 * const csv = convertToCSV(data, headers);
 * ```
 */
export const convertToCSV = (
  data: Record<string, unknown>[],
  headers?: Record<string, string>,
): string => {
  if (!data || data.length === 0) {
    return '';
  }

  const objectHeaders = Object.keys(data[0]);
  const csvHeaders: Record<string, string> = headers || {};

  // Initialize headers without spread
  for (const key of objectHeaders) {
    if (!csvHeaders[key]) {
      csvHeaders[key] = key;
    }
  }

  // Create CSV header row
  const headerRow = objectHeaders.map((header) => csvHeaders[header]).join(',');

  // Create CSV data rows
  const rows = data.map((item) =>
    objectHeaders
      .map((header) => {
        const value = item[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      })
      .join(','),
  );

  return [headerRow, ...rows].join('\n');
};

/**
 * Converts data to JSON format with optional pretty printing
 * @param data - Data to convert to JSON
 * @param pretty - Whether to format the JSON with indentation
 * @returns JSON string
 * @example
 * ```ts
 * const data = { name: 'John', age: 30 };
 * const json = convertToJSON(data, true);
 * ```
 */
export const convertToJSON = (data: unknown, pretty = false): string => {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
};

/**
 * Downloads a file with the given content
 * @param content - File content to download
 * @param filename - Name of the file
 * @param mimeType - MIME type of the file
 * @example
 * ```ts
 * downloadFile('Hello, World!', 'greeting.txt', 'text/plain');
 * ```
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports data as a CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the output file (without extension)
 * @param headers - Optional mapping of object keys to CSV headers
 * @example
 * ```ts
 * const data = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ];
 * exportAsCSV(data, 'users', { id: 'ID', name: 'Name' });
 * ```
 */
export const exportAsCSV = (
  data: Record<string, unknown>[],
  filename: string,
  headers?: Record<string, string>,
): void => {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, `${filename}.csv`, 'text/csv');
};

/**
 * Exports data as a JSON file
 * @param data - Data to export
 * @param filename - Name of the output file (without extension)
 * @param pretty - Whether to format the JSON with indentation
 * @example
 * ```ts
 * const data = { users: [{ id: 1, name: 'John' }] };
 * exportAsJSON(data, 'data', true);
 * ```
 */
export const exportAsJSON = (data: unknown, filename: string, pretty = false): void => {
  const json = convertToJSON(data, pretty);
  downloadFile(json, `${filename}.json`, 'application/json');
};

/**
 * Exports chart data in multiple formats
 * @param data - Chart data to export
 * @param filename - Base name for the output files
 * @param format - Format to export ('csv' | 'json' | 'both')
 * @param options - Additional export options
 * @example
 * ```ts
 * const chartData = {
 *   labels: ['Jan', 'Feb', 'Mar'],
 *   datasets: [{ data: [10, 20, 30] }]
 * };
 * exportChartData(chartData, 'chart', 'both', { pretty: true });
 * ```
 */
export const exportChartData = (
  data: ChartData,
  filename: string,
  format: 'csv' | 'json' | 'both' = 'both',
): void => {
  if (format === 'json' || format === 'both') {
    exportAsJSON(data, filename, true);
  }

  if (format === 'csv' || format === 'both') {
    // Transform chart data for CSV export
    const csvData = data.labels.map((label: string, index: number) => {
      const row: Record<string, unknown> = { label };
      for (const [datasetIndex, dataset] of data.datasets.entries()) {
        row[`series_${datasetIndex + 1}`] = dataset.data[index];
      }
      return row;
    });
    exportAsCSV(csvData, filename);
  }
};
