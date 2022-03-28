import { boolParse, assocIf } from "../../src/logic/misc.js";

describe("boolParse", () => {
    it("converts input to a boolean result", () => {
        expect(boolParse()).toBe(false);
        expect(boolParse("")).toBe(false);
        expect(boolParse(" ")).toBe(false);
        expect(boolParse("false")).toBe(false);
        expect(boolParse("F")).toBe(false);
        expect(boolParse("N")).toBe(false);
        expect(boolParse("n")).toBe(false);
        expect(boolParse("no")).toBe(false);
        expect(boolParse(0)).toBe(false);
        expect(boolParse(true)).toBe(true);
        expect(boolParse("T")).toBe(true);
        expect(boolParse("S")).toBe(true);
        expect(boolParse("Y")).toBe(true);
        expect(boolParse("yes")).toBe(true);
        expect(boolParse("true")).toBe(true);
        expect(boolParse(1)).toBe(true);
        expect(boolParse(1)).toBe(true);
    });
});

describe("assocIf", () => {
    it("assocs new key to object if value is not empty", () => {
        const d = new Date();
        expect(assocIf({ a: 1 }, "b", null)).toEqual({ a: 1 });
        expect(assocIf({ a: 1 }, "b", 2)).toEqual({ a: 1, b: 2 });
        expect(assocIf({ a: 1 }, "b", d)).toEqual({ a: 1, b: d });
        expect(assocIf({ a: 1 }, "b", true)).toEqual({ a: 1, b: true });
        expect(assocIf({ a: 1 }, "b", false)).toEqual({ a: 1, b: false });
    });
});
