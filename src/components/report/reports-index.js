import { capitalizeFirstLetter } from "../../logic/misc.js";

function initAccordion({ id }, { UIkit, document }) {
    UIkit.accordion(document.getElementById(id));
}

function itemClick(context, reportId) {
    context.ReportParams(context, reportId)
        .get()
        .then(p => context.ReportDialog(context, p).show());
}

function groupContent(context, reports) {
    return reports.map(
        r => ["li", {style: { cursor: "pointer" }, onclick: () => itemClick(context, r.id) }, r.title]
    );
}

const groupItem = (context, reports, title) => ["li",
                                       ["a", { class: ["uk-accordion-title"] }, capitalizeFirstLetter(title)],
                                       ["div", { class: ["uk-accordion-content"] },
                                        ["ul", { class: ["uk-list uk-list-striped uk-nav"] },
                                         ...groupContent(context, reports)]]],
      groupsList = (context, groups) => _.map(groups, (reports, title) => groupItem(context, reports, title));

function view(context, reports) {
    return ["ul", { class: ["uk-accordion"], private: { initAccordion } },
            ...groupsList(context, _.groupBy(reports, "group"))];
}

function ReportsIndex(context) {
    const { config, httpClient, Dom } = context,
          fetchOptions = { mode: "cors", errorMessage: "ATENÇÃO O índice de relatórios não está disponível" },
          reportsUrl = config.apiUrl("reports");

    function index() {
        return httpClient.GET(reportsUrl, fetchOptions)
            .then(r => r.json())
            .then(r => Dom(context, view(context, r.reports)));
    }

    return {
        index,
    };
}

export default ReportsIndex;
