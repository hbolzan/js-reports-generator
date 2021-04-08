import { marginsToCSS, pageToCSS, objectToCSS } from "../../src/logic/report.js";

describe("objects to css style conversion", () => {
    test("convert margins object to CSS style", () => {
        expect(marginsToCSS({ left: "10mm", top: "12mm", right: "15mm", bottom: "20mm" }))
            .toBe("margin-left: 10mm; margin-top: 12mm; margin-right: 15mm; margin-bottom: 20mm");
    });

    test("convert margins object to CSS style", () => {
        expect(marginsToCSS({ left: "11mm", top: "12mm", right: "13mm", bottom: "14mm" }))
            .toBe("margin-left: 11mm; margin-top: 12mm; margin-right: 13mm; margin-bottom: 14mm");
    });

    test("returns empty string if there are no margins", () => {
        expect(marginsToCSS(null)).toBe("");
    });

    test("convert page object to CSS style", () => {
        const expectedMargins = "margin-left: 10mm; margin-top: 15mm; margin-right: 10mm; margin-bottom: 5mm",
              margins = {left: "10mm", top: "15mm", right: "10mm", bottom: "5mm" };

        expect(pageToCSS({ size: "A4", orientation: "portrait", margins: margins }))
            .toBe(`@page { size: A4 portrait; ${ expectedMargins } }`);

        expect(pageToCSS({ size: "letter", orientation: "landscape", margins: margins }))
            .toBe(`@page { size: letter landscape; ${ expectedMargins } }`);
    });

    test("returns empty string if page is null", () => {
        expect(pageToCSS(null)).toBe("");
    });


    test("converts object to CSS style", () => {
        expect(objectToCSS("html", { fontSize: "12px" })).toBe("html { font-size: 12px; }");
        expect(objectToCSS("tr", { borderTop: "none" })).toBe("tr { border-top: none; }");
    });
});
