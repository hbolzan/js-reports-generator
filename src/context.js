import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import { v4 as uuidv4 } from "uuid";
import datepicker from "js-datepicker";
import Inputmask from "inputmask";
import Dom from "./components/dom/dom.js";
import Mask from "./components/report/mask.js";
import DatePicker from "./components/report/date-picker.js";
import Reporter from "./components/report/reporter.js";
import ReportsIndex from "./components/report/reports-index.js";
import ReportParams from "./components/report/report-params.js";
import ReportDialog from "./components/report/report-dialog.js";
import SimpleTemplate from "./templates/simple.js";

UIkit.use(Icons);

const api = {
    protocol: "http",
    host: "localhost:9999",
    baseUrl: "/api/v1",
};

const context = {
    global: window,
    document: window.document,
    uuidGen: uuidv4,
    api,

    templates: {
        SimpleTemplate,
    },

    UIkit,
    datepicker,
    Inputmask,
    Mask,
    DatePicker,
    Dom,
    ReportsIndex,
    ReportParams,
    ReportDialog,
    Reporter,
};

export default context;
