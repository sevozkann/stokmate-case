export const money = (minorUnits: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    minorUnits / 100,
  );

export const stockState = (stock: number, min: number) =>
  stock === 0 ? "Tükendi" : stock <= min ? "Kritik" : "Yeterli";

export const toMinorUnits = (value: string) =>
  Math.round(Number(value.replace(",", ".")) * 100);

export const fromMinorUnits = (value: number) =>
  (value / 100).toFixed(2).replace(".", ",");
