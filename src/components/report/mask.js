const options = {
    radixPoint: ",",
    groupSeparator: ".",
    numericInput: true,
};

const initMask = ({ id }, { Inputmask, document }, alias) => {
    return Inputmask(alias, options).mask(document.getElementById(id));
};

function Mask({ Inputmask }) {
    return {
        int: (node, context) => initMask(node, context, "integer"),
        float: (node, context) => initMask(node, context, "numeric"),
    };
}

export default Mask;
