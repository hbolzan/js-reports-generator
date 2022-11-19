const baseOptions = {
    radixPoint: ",",
    groupSeparator: ".",
    numericInput: true,
};

const initMask = ({ id }, { Inputmask, document }, alias, options = {}) => {
    return Inputmask(alias, { ...baseOptions, ...options }).mask(document.getElementById(id));
};

function Mask({ Inputmask }) {
    return {
        int: (node, context) => initMask(node, context, "integer"),
        float: (node, context, options = {}) => initMask(node, context, "numeric", options),
    };
}

export default Mask;
