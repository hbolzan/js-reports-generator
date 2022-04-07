const borderStyles = [
    ".group-container {border: 1px solid #e5e5e5; margin-bottom: 10px; padding: 5px;}",
    "table.group-table {width: 100%; border-top: 1px solid #e5e5e5}",
    ".group-header {border-bottom: 1px solid #e5e5e5;}",
    "table.group-table tr td:not(:last-child), tr th:not(:last-child) {border-right: 1px solid #e5e5e5;}",
    "table.group-table tbody tr td {border-top: 1px solid #e5e5e5;}",
    "table.group-table thead tr th {font-weight: bold!important;}",
    "table.group-table tbody tr:first-child td {border-top: 1px solid #e5e5e5;}",
    "table.group-table tr:last-child td {border-top: 1px solid #e5e5e5; border-right: none;}",

    ".uk-table-divider :first-child tr:not(:first-child),\n" +
        ".uk-table-divider :not(:first-child) tr,\n" +
        ".uk-table-divider tr:not(:first-child) {border-top: none;}",
];

const defaultPageStyle = {
    global: {
        css: borderStyles,
    },

    mediaScreen: {
        styles: [
            "body {margin: 50px 60px}",
            "tr:last-child td {border-right: none;}",
        ]
    },

    mediaPrint: {

        page: {
            size: "A4",
            orientation: "portrait",
            margins: { unit: "mm", left: 15, top: 10, right: 15, bottom: 10 }
        },

        html: {
            fontSize: "12px",
            lineHeight: 1.0,
            marginBottom: "5mm",
        },

        styles: [
            ".empty-th {min-height: 10mm;}",
            "header {position: fixed; top: 0; height: 50mm;}",
            "footer {position: fixed; bottom: 0;}",
            ".report-header, .report-footer, .header-space, .footer-space {height: 18mm;}",
            ".report-header {position: fixed; top: 0;}",
            ".report-footer {position: fixed; bottom: 5mm; left: -10mm;}",
        ]
    }
};

export { defaultPageStyle };
