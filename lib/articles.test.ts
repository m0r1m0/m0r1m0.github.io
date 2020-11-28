import "jest";
import { getDate } from "./articles";

describe("getDate", () => {
  test("ファイル名に日付が含まれる", () => {
    const fileName = "2020-11-28-test1.md";
    const result = getDate(fileName);
    expect(result).toBe("2020年11月28日");
  });
  test("ファイル名に日付が含まれていない", () => {
    const fileName = "test1.md";
    const result = getDate(fileName);
    expect(result).toBe(null);
  });
});
