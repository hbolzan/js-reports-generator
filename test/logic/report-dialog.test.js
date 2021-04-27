import { constantly } from "../../src/logic/misc.js";
import { dlgInput } from "../../src/logic/report-dialog.js";

// (ptDate, ptDateRange, ptInt, ptIntRange, ptFloat, ptFloatRange, ptText, ptRadioGroup, ptCheckBox)

const intMask = x => x,
      floatMask = y => y;

function Mask() {
    return {
        int: intMask,
        float: floatMask,
    };
}

describe("Dialog input", () => {
    it("returns input according to param type", () => {
        expect(dlgInput(
            { uuidGen: constantly("xyz") },
            { type: "ptText", name: { from: "param_x" }},
            "from",
        )).toEqual(["input", { id: "xyz", name: "param_x", class: ["uk-input"]}]);

        expect(dlgInput(
            { uuidGen: constantly("abc"), Mask },
            { type: "ptInt", name: { from: "param_y" } },
            "from",
        )).toEqual(
            ["input", { id: "abc", name: "param_y", class: ["uk-input"], private: { init: intMask } }]
        );
    });
});


const param = {
    "type": "ptDateRange",
    "name": {
        "from": "d_ini",
        "to": "d_fim"
    },
    "caption": "Pedidos no período de",
    "suggestion": {
        "from": "DIA1",
        "to": "DMAX"
    },
    "width": 0,
    "numberFormat": "",
    "checkBoxOptions": {
        "valueChecked": "",
        "valueUnchecked": "",
        "checked": false
    },
    "radioGroupOptions": {
        "captions": [],
        "values": [],
        "selectedOption": 0
    }
}
