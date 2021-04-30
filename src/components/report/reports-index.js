import { capitalizeFirstLetter } from "../../logic/misc.js";

function initAccordion({ id }, { UIkit, document, global }) {
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
    const { global, api, Dom } = context,
          reportsUrl = `${ api.protocol }://${ api.host }${ api.baseUrl }/reports`;

    function index() {
        return global.fetch(reportsUrl, { method: "GET", mode: "cors" })
            .then(r => r.json())
            .then(r => Dom(context, view(context, r.reports)));
    }

    return {
        index,
    };
}

export default ReportsIndex;
