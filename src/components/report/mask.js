

const options = {
    radixPoint: ",",
    groupSeparator: ".",
    numericInput: true,
};


function Mask({ Inputmask }, type) {
    const intMask = () => Inputmask("9999999", options),
          floatMask = () => Inputmask("9999999.99", options);

    return {
        int: intMask,
        float: floatMask,
    };
}

export default Mask;
