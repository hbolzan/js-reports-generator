import { marginsToCSS, pageToCSS, objectToCSS } from "../../src/logic/report.js";

describe("objects to css style conversion", () => {
    test("convert margins object to CSS style", () => {
        expect(marginsToCSS({ unit: "mm", left: 10, top: 12, right: 15, bottom: 20 }))
            .toBe("margin-left: 10mm; margin-top: 12mm; margin-right: 15mm; margin-bottom: 20mm");
    });

    test("convert margins object to CSS style", () => {
        expect(marginsToCSS({ unit: "cm", left: 1, top: 2, right: 1, bottom: 1.5 }))
            .toBe("margin-left: 1cm; margin-top: 2cm; margin-right: 1cm; margin-bottom: 1.5cm");
    });

    test("convert margins object to CSS style", () => {
        expect(marginsToCSS({ unit: "mm", left: 11, top: 12, right: 13, bottom: 14 }))
            .toBe("margin-left: 11mm; margin-top: 12mm; margin-right: 13mm; margin-bottom: 14mm");
    });

    test("returns empty string if there are no margins", () => {
        expect(marginsToCSS(null)).toBe("");
    });

    test("convert page object to CSS style", () => {
        const expectedMargins = "margin-left: 10mm; margin-top: 15mm; margin-right: 10mm; margin-bottom: 5mm",
              margins = { unit: "mm", left: 10, top: 15, right: 10, bottom: 5 };

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
