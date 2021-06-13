import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import { v4 as uuidv4 } from "uuid";
import datepicker from "js-datepicker";
import Inputmask from "inputmask";
import Papa from "papaparse";
import Dom from "./components/dom/dom.js";
import Mask from "./components/report/mask.js";
import DatePicker from "./components/report/date-picker.js";
import Reporter from "./components/report/reporter.js";
import ReportsIndex from "./components/report/reports-index.js";
import ReportParams from "./components/report/report-params.js";
import ReportDialog from "./components/report/report-dialog.js";
import Page from "./components/page/page.js";
import SimpleTemplate from "./templates/simple.js";
import MiniPCPTemplate from "./templates/minipcp.js";

UIkit.use(Icons);

const api = {
    protocol: "http",
    host: "localhost:9999",
    baseUrl: "/api/v1",
};

const baseContext = {
    global: window,
    document: window.document,
    uuidGen: uuidv4,
    api,
    reportStyleSheetId: uuidv4(),

    renderNodes: {
        dialog: "dialog-body",
        reportsIndex: "index-body",
        pageHeader: "page-header",
        reportContainer: "report-container",
        reportCloseButton: "report-close-button",
    },

    templates: {
        SimpleTemplate,
        MiniPCPTemplate,
        Default: SimpleTemplate,
    },

    UIkit,
    datepicker,
    Inputmask,
    Papa,
    Mask,
    DatePicker,
    Dom,
    ReportsIndex,
    ReportParams,
    ReportDialog,
    Reporter,
};

const context = { ...baseContext, page: Page(baseContext) };

export default context;
