import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import { v4 as uuidv4 } from "uuid";
import datepicker from "js-datepicker";
import Inputmask from "inputmask";
import Papa from "papaparse";
import getBrowserFingerprint from "get-browser-fingerprint";
import Config from "./config.js";
import MessageBroker from "./components/message-broker.js";
import HttpClient from "./components/http-client.js";
import Auth from "./components/auth/auth.js";
import AuthDialog from "./components/auth/auth-dialog.js";
import Dom from "./components/dom/dom.js";
import Mask from "./components/report/mask.js";
import DatePicker from "./components/report/date-picker.js";
import Modal from "./components/modal.js";
import Reporter from "./components/report/reporter.js";
import ReportsIndex from "./components/report/reports-index.js";
import ReportParams from "./components/report/report-params.js";
import ReportDialog from "./components/report/report-dialog.js";
import FeaturesIndex from "./components/feature/features-index.js";
import Features from "./components/feature/features.js";
import ActionsFactory from "./components/feature/actions-factory.js";
import MainIndex from "./components/page/main-index.js";
import Page from "./components/page/page.js";
import SimpleTemplate from "./templates/simple.js";
import GroupdDataTemplate from "./templates/grouped.js";
import commonViews from "./views/common/index.js";

UIkit.use(Icons);

const _ = require("lodash"),
      global = window,
      document = global.document,
      uuidGen = uuidv4,
      browserFingerprint = getBrowserFingerprint(),
      messageBroker = MessageBroker(),

      templates = {
          SimpleTemplate,
          GroupdDataTemplate,
          Default: GroupdDataTemplate,
      },

      views = {
          commonViews,
      },

      config = Config({ _, templates }),

      independentContext = {
          _,
          global,
          document,
          UIkit,
          Inputmask,
          Papa,
          Mask,
          DatePicker,
          datepicker,
          browserFingerprint,
          uuidGen,
          reportStyleSheetId: uuidGen(),

          config,
          topics: config.topics,
          renderNodes: config.renderNodes,
          templates,
          views,
          api: config.api,

          messageBroker,
          Modal,
          Dom,
          ReportsIndex,
          ReportParams,
          ReportDialog,
          Reporter,

          FeaturesIndex,

          MainIndex,
      },

      auth = Auth(independentContext),
      baseContext = {
          ...independentContext,
          auth,
      },

      fullContext = {
          ...baseContext,
          httpClient: HttpClient(baseContext),
          authDialog: AuthDialog(baseContext),
      },

      actionsFactory = ActionsFactory(baseContext),
      features = Features({ ...fullContext, actionsFactory }),

      context = {
          ...fullContext,
          features,
          page: Page({ ...fullContext, features }),
      };

export default context;
