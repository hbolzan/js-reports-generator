import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import Dom from "./dom/dom.js";
import { v4 as uuidv4 } from "uuid";

UIkit.use(Icons);

const context = {
    global: window,
    document: window.document,
    uuidGen: uuidv4,

    UIkit,
    Dom,
}
