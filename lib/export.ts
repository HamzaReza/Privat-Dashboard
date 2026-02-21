import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportFormat = "csv" | "xlsx" | "pdf";

export function exportCsv(
  filenameBase: string,
  headers: string[],
  rows: string[][]
): void {
  const csvRows = [headers, ...rows].map((row) =>
    row.map(escapeCsvField).join(",")
  );
  const csv = csvRows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}_${formatDate()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportXlsx(
  filenameBase: string,
  headers: string[],
  rows: string[][]
): void {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filenameBase}_${formatDate()}.xlsx`);
}

export function exportPdf(
  filenameBase: string,
  headers: string[],
  rows: string[][]
): void {
  const doc = new jsPDF({ orientation: "landscape" });
  autoTable(doc, {
    head: [headers],
    body: rows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [250, 248, 243] },
  });
  doc.save(`${filenameBase}_${formatDate()}.pdf`);
}

export function exportData(
  format: ExportFormat,
  filenameBase: string,
  headers: string[],
  rows: string[][]
): void {
  switch (format) {
    case "csv":
      exportCsv(filenameBase, headers, rows);
      break;
    case "xlsx":
      exportXlsx(filenameBase, headers, rows);
      break;
    case "pdf":
      exportPdf(filenameBase, headers, rows);
      break;
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDate(): string {
  return new Date().toISOString().split("T")[0];
}
