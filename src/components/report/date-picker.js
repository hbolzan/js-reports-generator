const abbreviatedWeekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      abbreviatedMonthsNames = [
          "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ],
      fullMonthsNames = [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro"
      ];

const datePickerFormatter = (input, date, instance) => {
    input.value = date.toLocaleDateString(locale);
};

const datePickerOptions = {
    formatter: datePickerFormatter,
    position: "br",
    customDays: abbreviatedWeekDays,
    customMonths: fullMonthsNames,
    customOverlayMonths: abbreviatedMonthsNames,
    overlayButton: "Confirmar",
    overlayPlaceholder: "Ano no formato AAAA",
    showAllDates: true,
    respectDisabledReadOnly: true,
};

function init ({ id }, { Inputmask, datepicker, document }) {
    datepicker(`#${ id }`, datePickerOptions);
    Inputmask({
        alias: "datetime",
        inputFormat: "dd/mm/yyyy",
        placeholder: "dd/mm/aaaa",
        clearIncomplete: true,
    }).mask(document.getElementById(id));
}

function DatePicker(context) {
    return {
        init,
    };
}
export default DatePicker;