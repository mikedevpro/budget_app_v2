type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

function escapeCsvValue(value: string | number) {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function exportExpensesToCsv(
  expenses: Expense[],
  filename = "expenses.csv"
) {
  const headers = ["Name", "Category", "Amount", "Date"];

  const rows = expenses.map((expense) => [
    escapeCsvValue(expense.name),
    escapeCsvValue(expense.category),
    escapeCsvValue(expense.amount.toFixed(2)),
    escapeCsvValue(new Date(expense.spentAt).toISOString().slice(0, 10)),
  ]);

  const csvContent = [headers.map(escapeCsvValue), ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}