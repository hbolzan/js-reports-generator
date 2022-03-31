import { constantly } from "../../src/logic/misc.js";
import { dlgInput } from "../../src/logic/report-dialog.js";
import reportParamsForm from "../../src/logic/report-dialog.js";

const intMask = x => x,
      floatMask = y => y;

function Mask() {
    return {
        int: intMask,
        float: floatMask,
    };
}

describe("Report params dialog input", () => {
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
             ["label", { class: ["uk-text-light"] },
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "A", checked: true }],
              ["span", { class: ["uk-margin-small-left", "uk-margin-right"] }, "First"]],
             ["label", { class: ["uk-text-light"] },
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "B" }],
              ["span", { class: ["uk-margin-small-left", "uk-margin-right"] }, "Second"]],
            ["label", { class: ["uk-text-light"] },
              ["input", { class: ["uk-radio"], type: "radio", name: "filtro", value: "F" }],
              ["span", { class: ["uk-margin-small-left", "uk-margin-right"] }, "Third"]]
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
              ["span", { class: ["uk-text-bold", "uk-margin-left"] }, "Aprovados"]]]
        );
    });

    it("returns date input with datepicker", () => {
        const init = x => x,
              DatePicker = () => ({ init }),
              dateRangeParam = {
                  "type": "ptDateRange",
                  "name": { "from": "start_date", "to": "end_date" },
                  "suggestion": { "from": "DIA1", "to": "DMAX" },
              },
              dateInputFrom = dlgInput({ DatePicker, uuidGen: constantly("abdc") }, dateRangeParam, "from"),
              dateInputTo = dlgInput({ DatePicker, uuidGen: constantly("wxyz") }, dateRangeParam, "to");
        expect(dateInputFrom)
            .toEqual(["div", { class: ["uk-inline"]},
                            ["input", {
                                id: "abdc",
                                name: "start_date",
                                class: ["uk-input"],
                                dataSubType: "date",
                                type: "text",
                                style: { cursor: "pointer" },
                                private: { init: expect.any(Function) },
                            }],
                            ["span", { class: ["uk-form-icon", "uk-form-icon-flip"], ukIcon: "calendar" }],
                           ]);
        expect(dateInputFrom[2][1].private.init).toEqual(expect.any(Function));
        expect(dateInputTo[2][1].name).toBe("end_date");
    });
});

describe("Report params dialog form", () => {
    const init = x => x,
          DatePicker = () => ({ init }),
          dialogParams = [
              {
                  "type": "ptDateRange",
                  "name": { "from": "d_ini", "to": "d_fim" },
                  "caption": "Pedidos no período de",
                  "suggestion": { "from": "DIA1", "to": "DMAX" },
              },
              {
                  "type": "ptInt",
                  "name": { "from": "vnd_cod", "to": "" },
                  "caption": "Código do vendedor (zero para todos)",
                  "suggestion": { "from": "0", "to": "" },
              },
          ],
          reportParams = { settings: { title: "Test Report"}, dialogParams };

    const expected = ["div", {"class": ["uk-card", "uk-card-default", "uk-card-hover", "uk-card-body", "uk-width-2-3"]},
 ["h3", {"class": ["uk-card-title"]}, "Test Report"],
 ["form", {"class": ["uk-form-stacked"]},
  ["div", {"class": ["uk-margin"]},
   ["label", {"class": ["uk-text-bold", "uk-form-label"], "for": "xyz-from"}, "Pedidos no período de"],
   ["div",
    ["div", {"class": ["uk-inline", "uk-margin-right"]},
     ["div", {"class": ["uk-inline"]},
      ["input", {
          "id": "xyz-from",
          "name": "d_ini",
          "class": ["uk-input"],
          dataSubType: "date",
          "type": "text",
          "style": {"cursor": "pointer"},
          private: { init: expect.any(Function) },
      }],
      ["span", {"class": ["uk-form-icon", "uk-form-icon-flip"], "ukIcon": "calendar"}]]],
    ["div", {"class": ["uk-inline"]},
     ["div", {"class": ["uk-inline"]},
      ["input", {
          "id": "xyz-to",
          "name": "d_fim",
          "class": ["uk-input"],
          dataSubType: "date",
          "type": "text",
          "style": {"cursor": "pointer"},
          private: { init: expect.any(Function) },
      }],
      ["span", {"class": ["uk-form-icon", "uk-form-icon-flip"], "ukIcon": "calendar"}]]]]],
  ["div", {"class": ["uk-margin"]},
   ["label", {"class": ["uk-text-bold", "uk-form-label"], "for": "abc"}, "Código do vendedor (zero para todos)"],
   ["div", {"class": ["uk-form-controls"]},
    ["input", {"id": "abc", "name": "vnd_cod", "class": ["uk-input"], "private": { init: intMask }, value: "0"}]]]],
 ["div", {"href": "", onclick: undefined, "class": ["uk-button", "uk-button-primary", "uk-button-large", "uk-margin-large-top", "uk-align-right"]},
  ["span", {"ukIcon": "print"}],
  ["span", {"class": ["uk-margin-small-left"]}, "GERAR RELATÓRIO"]]];

    const mockUuidGen = (ids) => () => {
        const result = ids.slice(0, 1)[0];
        ids = ids.slice(1);
        return result;
    };
    const uuidGen = mockUuidGen(["xyz-from", "xyz-to", "abc"]);
    // console.log(JSON.stringify(reportParamsForm({ uuidGen, DatePicker, Mask }, reportParams), null, 2));
    it("returns a form with params inputs", () => {
        expect(reportParamsForm({ uuidGen, DatePicker, Mask }, reportParams))
            .toStrictEqual(expected);
    });
});
