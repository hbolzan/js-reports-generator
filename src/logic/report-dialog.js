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

const inputs = {
    ptText: textInput,
    ptInt: numericInput,
    ptIntRange: numericInput,
    ptFloat: numericInput,
    ptFloatRange: numericInput,
    ptRadioGroup: radioGroup,
};

function dlgInput(context, param, origin) {
    return inputs[param.type](context, param, origin);
}

export { dlgInput };
