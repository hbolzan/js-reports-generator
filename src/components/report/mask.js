

const options = {
    radixPoint: ",",
    groupSeparator: ".",
    numericInput: true,
};


const initMask = mask => ({ id }, { document }) => mask.mask(document.getElementById(id));

function Mask({ Inputmask }) {
    return {
        int: initMask(Inputmask("9999999")),
        float: initMask(Inputmask("9999999.99", options)),
    };
}

export default Mask;
