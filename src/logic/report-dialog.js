import { constantly } from "./misc.js";

function baseAttrs(id, name) {
    return { id, name, class: ["uk-input"]};
}

function textInput({ uuidGen }, param) {
    return ["input", baseAttrs(uuidGen(), param.name.from)];
}

function typeIsInt(paramType) {
    return paramType === "ptInt" || paramType === "ptIntRange";
}

function numericInput(context, param, origin) {
    const { uuidGen, Mask } = context,
          maskMethod = typeIsInt(param.type) ? "int" : "float";
    return [
        "input",
        {
            ...baseAttrs(uuidGen(), param.name[origin]),
            private: { init: context.Mask(context)[maskMethod] },
        }
    ];
}

function radioAttrs(param, index) {
    return Object.assign(
        {
            class: ["uk-radio"],
            type: "radio",
            name: param.name.from,
            value: param.radioGroupOptions.values[index],
        },
        param.radioGroupOptions.selectedOption === index ? { checked: true } : {}
    );
}

function radioItem(param, caption, index) {
    return ["label",
            ["input", radioAttrs(param, index)], caption];
}

function radioItems(param) {
    return param.radioGroupOptions.captions.map((caption, index) => radioItem(param, caption, index));
}

function radioGroup(context, param, origin) {
    return ["div", { class: ["uk-form-controls"] },
            ...radioItems(param)];
}

function checkBox(context, param, origin) {
    return ["div", { class: ["uk-form-controls"] },
            ["label",
             ["input", {
                 class: ["uk-checkbox"],
                 type: "checkbox",
                 name: param.name.from,
                 dataValueChecked: param.checkBoxOptions.valueChecked,
                 dataValueUnchecked: param.checkBoxOptions.valueUnchecked,
             }],
             param.caption]];
}

function dateInput(context, param, origin) {
    return ["div", { class: ["uk-inline"]},
            ["input", {
                id: context.uuidGen(),
                name: param.name[origin],
                class: ["uk-input"],
                type: "text",
                style: { cursor: "pointer" },
                private: { init: context.DatePicker(context).init }
            }],
            ["span", { class: ["uk-form-icon", "uk-form-icon-flip"], ukIcon: "calendar" }],
           ];
}

const inputs = {
    ptText: textInput,
    ptInt: numericInput,
    ptIntRange: numericInput,
    ptFloat: numericInput,
    ptFloatRange: numericInput,
    ptRadioGroup: radioGroup,
    ptCheckBox: checkBox,
    ptDate: dateInput,
    ptDateRange: dateInput,
};

function dlgInput(context, param, origin) {
    return inputs[param.type](context, param, origin);
}

function dlgField(context, param) {
    const idFrom = context.uuidGen();
    if ( ["ptIntRange", "ptFloatRange", "ptDateRange"].includes(param.type) ) {
        return ["div", { class: ["uk-margin" ] },
                ["label", { class: ["uk-form-label"], for: idFrom }, param.caption],
                ["div", { class: ["uk-form-controls"] },
                 dlgInput({ ...context, uuidGen: constantly(idFrom) }, param, "from")],
                ["div", { class: ["uk-form-controls"] },
                 dlgInput(context, param, "to")]];
    }
    return ["div", { class: ["uk-margin" ] },
            ["label", { class: ["uk-form-label"], for: idFrom }, param.caption],
            ["div", { class: ["uk-form-controls"] },
             dlgInput({ ...context, uuidGen: constantly(idFrom) }, param, "from")]];
}

function reportParamsForm(context, params) {
    return ["form", { class: ["uk-form-stacked"] }, ...params.map(param => dlgField(context, param))];
}

export default reportParamsForm;
export { dlgInput };
