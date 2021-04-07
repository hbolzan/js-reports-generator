import { marginsToCSS } from "../../src/logic/report.js";

describe("objects to css style conversion", () => {
    test("convert object to CSS style", () => {
        expect(marginsToCSS({ left: "10mm", top: "12mm", right: "15mm", bottom: "20mm" }))
            .toBe("margin-left: 10mm; margin-top: 12mm; margin-right: 15mm; margin-bottom: 20mm");
    });

    test("convert object to CSS style", () => {
        expect(marginsToCSS({ left: "11mm", top: "12mm", right: "13mm", bottom: "14mm" }))
            .toBe("margin-left: 11mm; margin-top: 12mm; margin-right: 13mm; margin-bottom: 14mm");
    });
});
