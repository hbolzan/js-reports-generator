import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import { v4 as uuidv4 } from "uuid";
import Dom from "./components/dom/dom.js";
import Reporter from "./components/report/reporter.js";
import SimpleTemplate from "./templates/simple.js";

UIkit.use(Icons);

const context = {
    global: window,
    document: window.document,
    uuidGen: uuidv4,

    templates: {
        SimpleTemplate,
    },

    UIkit,
    Dom,
    Reporter,
};

export default context;
