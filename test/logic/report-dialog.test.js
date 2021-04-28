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

describe("Dialog params input", () => {
    it("returns text and numeric input according to param type", () => {
        expect(dlgInput(
            { uuidGen: constantly("xyz") },
            { type: "ptText", name: { from: "param_x" }},
            "from",
        )).toStrictEqual(["input", { id: "xyz", name: "param_x", class: ["uk-input"]}]);

        const intInput = dlgInput(
            { uuidGen: constantly("abc"), Mask },
            { type: "ptInt", name: { from: "param_y" } },
            "from",
        );
        expect(intInput).toStrictEqual(
            ["input", { id: "abc", name: "param_y", class: ["uk-input"], private: { init: intMask } }]
        );
        expect(intInput[1].private.init).toBe(intMask);

        const intRangeInput = dlgInput(
            { uuidGen: constantly("def"), Mask },
            { type: "ptIntRange", name: { from: "param_y", to: "param_z" } },
            "to",
        );
        expect(intRangeInput).toStrictEqual(
            ["input", { id: "def", name: "param_z", class: ["uk-input"], private: { init: intMask } }]
        );
        expect(intRangeInput[1].private.init).toBe(intMask);

        const floatInput = dlgInput(
            { uuidGen: constantly("def"), Mask },
            { type: "ptFloat", name: { from: "param_y", to: "param_z" } },
            "from",
        );
        expect(floatInput).toStrictEqual(
            ["input", { id: "def", name: "param_y", class: ["uk-input"], private: { init: floatMask } }]
        );
        expect(floatInput[1].private.init).toBe(floatMask);

        const floatRangeInput = dlgInput(
            { uuidGen: constantly("def"), Mask },
            { type: "ptFloatRange", name: { from: "param_y", to: "param_z" } },
            "from",
        );
        expect(floatRangeInput).toStrictEqual(
            ["input", { id: "def", name: "param_y", class: ["uk-input"], private: { init: floatMask } }]
        );
        expect(floatRangeInput[1].private.init).toBe(floatMask);

        const floatRangeInputTo = dlgInput(
            { uuidGen: constantly("def"), Mask },
            { type: "ptFloatRange", name: { from: "param_y", to: "param_z" } },
            "to",
        );
        expect(floatRangeInputTo).toStrictEqual(
            ["input", { id: "def", name: "param_z", class: ["uk-input"], private: { init: floatMask } }]
        );
        expect(floatRangeInputTo[1].private.init).toBe(floatMask);
    });

    it("returns a radio group", () => {

        const radioParams = {
            type: "ptRadioGroup",
            name: { from: "filtro" },
            radioGroupOptions: {
                captions: ["First", "Second", "Third"],
                values: ["A", "B", "F"],
                selectedOption: 0,
            }
        };
        const radioGroup = dlgInput({ uuidGen: constantly("123") }, radioParams, "from");
        expect(radioGroup).toStrictEqual(
            ["div", { class: ["uk-form-controls"] },
             ["label",
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "A", checked: true }], "First"],
             ["label",
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "B" }], "Second"],
             ["label",
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "F" }], "Third"]
            ]
        );
    });

    it("returns a checkbox", () => {
        const checkBoxParams = {
            type: "ptCheckBox",
            name: { "from": "status_b" },
            caption: "Aprovados",
            checkBoxOptions: {valueChecked: "S", valueUnchecked: "N", checked: false },
        };
        const checkBox = dlgInput({ uuidGen: constantly("123") }, checkBoxParams, "from");
        expect(checkBox).toStrictEqual(
            ["div", { class: ["uk-form-controls"] },
             ["label",
              ["input", {
                  class: ["uk-checkbox"],
                  type: "checkbox",
                  name: "status_b",
                  dataValueChecked: "S",
                  dataValueUnchecked: "N",
              }],
              "Aprovados"]]
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
};
