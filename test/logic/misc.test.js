import { boolParse, pipe } from "../../src/logic/misc.js";

describe("boolParse", () => {
    it("converts input to a boolean result", () => {
        expect(boolParse()).toBe(false);
        expect(boolParse("")).toBe(false);
        expect(boolParse(" ")).toBe(false);
        expect(boolParse("false")).toBe(false);
        expect(boolParse("N")).toBe(false);
        expect(boolParse("n")).toBe(false);
        expect(boolParse("no")).toBe(false);
        expect(boolParse(0)).toBe(false);
        expect(boolParse(true)).toBe(true);
        expect(boolParse("S")).toBe(true);
        expect(boolParse("Y")).toBe(true);
        expect(boolParse("yes")).toBe(true);
        expect(boolParse("true")).toBe(true);
        expect(boolParse(1)).toBe(true);
    });
});
