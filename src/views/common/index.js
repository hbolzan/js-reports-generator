import { capitalizeFirstLetter } from "../../logic/misc.js";

function initSwitcher({ id }, { UIkit, document }) {
    UIkit.switcher(document.getElementById(id), { connect: ".switcher-body-container" });
}

function groupContent(context, items, onClick) {
    return items.map(
        item => [
            "li",
            {
                class: ["uk-active"],
                style: { cursor: "pointer" },
                onclick: () => onClick(context, item.id)
            },
            item.title
        ]
    );
}

const groupItem = (context, items, title, onClick) => ["li", { class: ["uk-parent", "uk-active"]},
                                                       ["a", { style: { fontSize: "medium", fontWeight: "400", }}, capitalizeFirstLetter(title || "Outros")],
                                                       ["ul", { class: ["uk-nav-sub", "uk-list", "uk-list-striped", "uk-text-small"] },
                                                        ...groupContent(context, items, onClick)]],
      groupsList = (context, groups, onClick) => {
          return _.map(groups, (items, title) => groupItem(context, items, title, onClick));
      };

function tabs(context, { reports, features }) {
    return ["section",
            ["ul", { class: ["uk-subnav", "uk-subnav-pill"], private: { initSwitcher } },
             ["li", { class: ["uk-active"]},
              ["a", { href: "#" }, "RELATÓRIOS"]],
             ["li",
              ["a", { href: "#" }, "FUNCIONALIDADES"]]],
            ["ul", { class: ["uk-switcher", "switcher-body-container"] },
             reports,
             features]];
}

function index(context, items, onClick) {
    return ["li",
            ["ul",
             {
                 class: ["uk-switcher", "uk-nav-parent-icon", "uk-nav-primary"],
                 ukNav: "uk-nav",
             },
             ...groupsList(context, _.groupBy(items, "group"), onClick)]];
}

export default { index, tabs };
