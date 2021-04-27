import "uikit/dist/css/uikit.min.css";
import context from "./context.js";

import { defaultPageStyle } from "./components/report/consts.js";

const params = {
    title: "My First Report",
    footer: "First Report Footer",
    style: defaultPageStyle,
};

const template = context.templates.SimpleTemplate(context, params);
const data = {
    columns: [
        { name: "id", label: "ID" },
        { name: "name", label: "Name" },
        { name: "addr", label: "Address" },
    ],
    rows: [
        { id: 1, name: "John Doe", addr: "Rua dos Bobos, número Zero"},
        { id: 2, name: "Jack Sparrow", addr: "Pirate Ship"},
        { id: 3, name: "Donald Trump", addr: "Trump Tower, NY"},
        { id: 4, name: "João Dória", addr: "Palácio dos Bandeirantes"},
    ],
};


function renderIndex() {
    context.ReportsIndex(context)
        .index()
        .then(dom => dom.render("index-body"));
}

function pageInit() {
    const { UIkit, document } = context;
    UIkit.sticky(document.getElementById("page-header"));
    renderIndex();
}

pageInit();


// context.Reporter(context, template)
//     .report(data)
//     .render("report-body");
