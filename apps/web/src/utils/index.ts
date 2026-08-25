export const currency = (minorUnits: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    minorUnits / 100,
  );

export const toMinorUnits = (value: string) =>
  Math.round(Number(value.replace(",", ".")) * 100);

export const fromMinorUnits = (value: number) =>
  (value / 100).toFixed(2).replace(".", ",");

export const stockTone = (stock: number, minStock: number) =>
  stock === 0
    ? "bg-danger-soft text-danger"
    : stock <= minStock
      ? "bg-warning-soft text-warning"
      : "bg-success-soft text-success";
