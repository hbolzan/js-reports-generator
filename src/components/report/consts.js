const units = {
    mm: x => `${ x }mm`,
    cm: x => `${ x }cm`,
    inches: x => `${ x }in`,
    px: x => `${ x }px`,
    em: x => `${ x }em`,
};

const pageSettings = {

    size: {
        A3: "A3",
        A4: "A4",
        A5: "A5",
        letter: "letter",
        legal: "legal",
    },

    orientation: {
        portrait: "portrait",
        landscape: "landscape",
    }

};

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
            "body {margin: 40px 80px;}",
            "html {font-size: 14px; line-height: 1;}",
            "tr:last-child td {border-right: none;}",
        ]
            .concat(borderStyles)
    },

    mediaPrint: {

        page: {
            size: pageSettings.size.A4,
            orientation: pageSettings.orientation.portrait,
            margins: {
                left: units.mm(15),
                top: units.mm(10),
                right: units.mm(15),
                bottom: units.mm(5),
            }
        },

        html: {
            fontSize: units.px(12),
            lineHeight: 0.8,
            marginBottom: units.mm(30),
        },

        styles: [
            ".empty-th {min-height: 10mm;}",
            "header {position: fixed; top: 0;}",
            "footer {position: fixed; bottom: 0;}",
        ]
            .concat(borderStyles)
    }
};

export { units, pageSettings, defaultPageStyle };
