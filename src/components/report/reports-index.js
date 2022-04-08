import { capitalizeFirstLetter } from "../../logic/misc.js";

function initAccordion({ id }, { UIkit, document }) {
    UIkit.accordion(document.getElementById(id));
}

function initSwitcher({ id }, { UIkit, document }) {
    UIkit.switcher(document.getElementById(id), { connect: ".switcher-body-container" });
}

function itemClick(context, reportId) {
    context.ReportParams(context, reportId)
        .get()
        .then(p => context.ReportDialog(context, p).show());
}

function groupContent(context, reports) {
    return reports.map(
        r => ["li", { class: ["uk-active"], style: { cursor: "pointer" }, onclick: () => itemClick(context, r.id) }, r.title]
    );
}

const groupItem = (context, reports, title) => ["li", { class: ["uk-parent", "uk-active"]},
                                                ["a", { style: { fontSize: "medium", fontWeight: "600", padding: "0" }}, capitalizeFirstLetter(title || "Outros")],
                                                ["ul", { class: ["uk-nav-sub", "uk-list", "uk-list-striped", "uk-text-small"] },
                                                 ...groupContent(context, reports)]],
      groupsList = (context, groups) => _.map(groups, (reports, title) => groupItem(context, reports, title));

function view(context, reports) {
    return ["section",
            ["ul", { class: ["uk-subnav", "uk-subnav-pill"], private: { initSwitcher } },
             ["li", { class: ["uk-active"]},
              ["a", { href: "#" }, "RELATÓRIOS"]],
             ["li",
              ["a", { href: "#" }, "FUNCIONALIDADES"]]],
            ["ul", { class: ["uk-switcher", "switcher-body-container"] },
             ["li",
              ["ul",
               {
                   class: ["uk-switcher", "uk-nav-parent-icon", "uk-nav-primary"],
                   ukNav: "uk-nav",
                   private: { initAccordion }
               },
               ...groupsList(context, _.groupBy(reports, "group"))]],
             ["li",
              ["ul",
               {
                   class: ["uk-switcher", "uk-nav-parent-icon", "uk-nav-primary"],
                   ukNav: "uk-nav",
                   private: { initAccordion }
               },
              ]]]];
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
