const borderStyles = [
    "tr td:not(:last-child), tr th:not(:last-child) {border-right: 1px solid #e5e5e5;}",
    "tbody tr td {border-top: 1px solid #e5e5e5;}",
    "thead tr th {font-weight: bold!important;}",
    "tbody tr:first-child td {border-top: 3px solid #e5e5e5;}",
    "tr:last-child td {border-top: 3px solid #e5e5e5; border-right: none;}",

    ".uk-table-divider :first-child tr:not(:first-child),\n" +
        ".uk-table-divider :not(:first-child) tr,\n" +
        ".uk-table-divider tr:not(:first-child) {border-top: none;}",
];

const defaultPageStyle = {
    mediaScreen: {
        styles: [
            "tr:last-child td {border-right: none;}",
        ]
            .concat(borderStyles)
    },

    mediaPrint: {

        page: {
            size: "A4",
            orientation: "portrait",
            margins: { unit: "mm", left: 15, top: 10, right: 15, bottom: 5 }
        },

        html: {
            fontSize: "12px",
            lineHeight: 0.8,
            marginBottom: "30mm",
        },

        styles: [
            ".empty-th {min-height: 10mm;}",
            "header {position: fixed; top: 0;}",
            "footer {position: fixed; bottom: 0;}",
        ]
            .concat(borderStyles)
    }
};

export { defaultPageStyle };
