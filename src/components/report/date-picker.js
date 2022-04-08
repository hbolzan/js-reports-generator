import { assocIf } from "../../logic/misc.js";

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
    input.value = date.toLocaleDateString("pt-BR");
};

function datePickerOptions(suggestion) {
    return assocIf({
        formatter: datePickerFormatter,
        position: "br",
        customDays: abbreviatedWeekDays,
        customMonths: fullMonthsNames,
        customOverlayMonths: abbreviatedMonthsNames,
        overlayButton: "Confirmar",
        overlayPlaceholder: "Ano no formato AAAA",
        showAllDates: true,
        respectDisabledReadOnly: true,
    }, "dateSelected", suggestion);
}

function init (suggestion, { id }, { Inputmask, datepicker, document }) {
    datepicker(`#${ id }`, datePickerOptions(suggestion));
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
