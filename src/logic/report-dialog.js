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
    return ["label", { class: ["uk-text-light"] },
            ["input", radioAttrs(param, index)],
            ["span", { class: ["uk-margin-small-left", "uk-margin-right"] }, caption]];
}

function radioItems(param) {
    return param.radioGroupOptions.captions.map((caption, index) => radioItem(param, caption, index));
}

function radioGroup(context, param, origin) {
    return ["div", { class: ["uk-form-controls"] },
            ...radioItems(param)];
}

function checkBoxOptions(param) {
    return Object.assign(
        {
            class: ["uk-checkbox"],
            type: "checkbox",
            name: param.name.from,
            dataValueChecked: param.checkBoxOptions.valueChecked,
            dataValueUnchecked: param.checkBoxOptions.valueUnchecked,
        },
        ( param.checkBoxOptions.checked ? { checked: true } : {} )
    );
}

function checkBox(context, param, origin) {
    return ["div", { class: ["uk-form-controls"] },
            ["label",
             ["input", checkBoxOptions(param)],
             ["span", { class: ["uk-text-bold", "uk-margin-left"] }, param.caption]]];
}

function dateInput(context, param, origin) {
    return ["div", { class: ["uk-inline"]},
            ["input", {
                id: context.uuidGen(),
                name: param.name[origin],
                class: ["uk-input"],
                type: "text",
                dataSubType: "date",
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

function dlgRangeField(context, param, inputId) {
    return ["div", { class: ["uk-margin"] },
            ["label", { class: ["uk-text-bold", "uk-form-label"], for: inputId }, param.caption],
            ["div",
             ["div", { class: ["uk-inline", "uk-margin-right"] },
              dlgInput({ ...context, uuidGen: constantly(inputId) }, param, "from")],
             ["div", { class: ["uk-inline"] },
              dlgInput(context, param, "to")]]];
}

function showLabel(param) {
    return param.type !== "ptCheckBox";
}

function dlgSingleField(context, param, inputId) {
    return ["div", { class: ["uk-margin"] },
            (showLabel(param) ? ["label", { class: ["uk-text-bold", "uk-form-label"], for: inputId }, param.caption] : ["span"]),
            ["div", { class: ["uk-form-controls"] },
             dlgInput({ ...context, uuidGen: constantly(inputId) }, param, "from")]];
}

function dlgField(context, param) {
    const inputId = context.uuidGen();
    if ( ["ptIntRange", "ptFloatRange", "ptDateRange"].includes(param.type) ) {
        return dlgRangeField(context, param, inputId);
    }
    return dlgSingleField(context, param, inputId);
}

function reportParamsForm(context, reportParams, buttonClick) {
    const params = reportParams.dialogParams;

    return ["div", { class: ["uk-card", "uk-card-default", "uk-card-hover", "uk-card-body", "uk-width-2-3"]},
            ["h3", { class: ["uk-card-title"] }, reportParams.title],
            ["form", { class: ["uk-form-stacked"] },
             ...params.map(param => dlgField(context, param))],
            ["div", {
                href: "",
                onclick: buttonClick,
                class: ["uk-button", "uk-button-primary", "uk-button-large", "uk-margin-large-top", "uk-align-right"]
            },
             ["span", { ukIcon: "print"}],
             ["span", { class: ["uk-margin-small-left"] }, "GERAR RELATÓRIO"]]];
}

function dateValue(dateInput) {
    const dateParts = dateInput.value.split("/");
    if ( dateParts.length < 3 ) {
        return "";
    }
    return `${ dateParts[2] }-${ dateParts[1] }-${ dateParts[0] }`;
}

const valueFns = {
    checkbox: i => i.checked ? i.dataset.valueChecked : i.dataset.valueUnchecked,
    radio: i => i.checked ? i.value : undefined,
    date: dateValue,
    text: i => i.value,
};

const inputType = input => input.dataset.subType || input.type,
      inputValue = input => valueFns[inputType(input)](input);

function collectReducer(collected, input) {
    const value = inputValue(input);
    if ( value === undefined || input.name === "" ) {
        return collected;
    }
    return [ ...collected, { name: input.name, value } ];
}

function collectArguments(inputs) {
    return inputs.reduce(collectReducer, []);
}

function argumentsToQueryString(args) {
    return args.map(a => `${ a.name }=${ a.value }`).join("&");
}

export default reportParamsForm;
export { dlgInput, collectArguments, argumentsToQueryString };
