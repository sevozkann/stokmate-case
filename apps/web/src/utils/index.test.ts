import { describe, expect, it } from "vitest";
import { fromMinorUnits, stockTone, toMinorUnits } from "./index";

describe("fiyat yardımcıları", () => {
  it("Türkçe ondalık fiyatı kuruşa çevirir", () => {
    expect(toMinorUnits("39,50")).toBe(3950);
  });

  it("kuruşu form alanı için Türkçe fiyata çevirir", () => {
    expect(fromMinorUnits(3950)).toBe("39,50");
  });
});

describe("stok durumu", () => {
  it("sıfır stokta hata rengini kullanır", () => {
    expect(stockTone(0, 10)).toContain("danger");
  });

  it("minimum stok ve altını uyarı rengiyle gösterir", () => {
    expect(stockTone(10, 10)).toContain("warning");
  });
});
