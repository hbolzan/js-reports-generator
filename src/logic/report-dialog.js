import { constantly, assocIf } from "./misc.js";

function baseAttrs(id, name) {
    return { id, name, class: ["uk-input"]};
}

const inputFns = {
    DEFAULT_CFOP_CODES: () => "5101,5102,6101,6102,6108,6119",
};

function textInput({ uuidGen }, param) {
    const fn = inputFns[param?.suggestion?.from];
    return ["input", assocIf({ ...baseAttrs(uuidGen(), param.name.from), }, "value", fn ? fn() : null)];
}

function typeIsInt(paramType) {
    return paramType === "ptInt" || paramType === "ptIntRange";
}

function paramSuggestion(param, origin) {
    return param.suggestion ? param.suggestion[origin] : null;
}

function numericInput(context, param, origin) {
    const { uuidGen, Mask } = context,
          maskMethod = typeIsInt(param.type) ? "int" : "float",
          suggestion = paramSuggestion(param, origin);
    return [
        "input",
        assocIf({
            ...baseAttrs(uuidGen(), param.name[origin]),
            private: { init: context.Mask(context)[maskMethod] },
        }, "value", suggestion),
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

const dateInitFns = {
    DATE: (date) => date,
    DIA1: (date) => new Date(date.getFullYear(), date.getMonth(), 1),
    DMAX: (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0),
};

function dateInputSuggestion(param, origin) {
    const fn = dateInitFns[paramSuggestion(param, origin)];
    return fn ? fn(new Date()) : null;
}

function datePickerInit(context, suggestion) {
    return (node, context) => context.DatePicker(context).init(suggestion, node, context);
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
                private: { init: datePickerInit(context, dateInputSuggestion(param, origin)) },
            }],
            ["span", { class: ["uk-form-icon", "uk-form-icon-flip"], ukIcon: "calendar" }]];
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

function reportParamsForm(context, reportSettings, buttonClick) {
    const params = reportSettings.dialogParams;

    return ["div", {
        class: ["uk-card-default", "uk-card", "uk-card-default", "uk-card-hover", "uk-card-body", "uk-width-2-3"],
        style: { zIndex: "980"},
        ukSticky: "offset: 100",
    },
            ["h3", { class: ["uk-card-title"] }, reportSettings.settings.title],
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

export default reportParamsForm;
export { dlgInput, collectArguments };
