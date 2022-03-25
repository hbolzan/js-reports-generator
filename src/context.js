import Icons from "uikit/dist/js/uikit-icons";
import UIkit from "uikit";
import { v4 as uuidv4 } from "uuid";
import datepicker from "js-datepicker";
import Inputmask from "inputmask";
import Papa from "papaparse";
import getBrowserFingerprint from "get-browser-fingerprint";
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
import Page from "./components/page/page.js";
import SimpleTemplate from "./templates/simple.js";
import MiniPCPTemplate from "./templates/minipcp.js";

UIkit.use(Icons);

const _ = require("lodash"),
      global = window,
      document = global.document,
      uuidGen = uuidv4,
      browserFingerprint = getBrowserFingerprint(),

      api = {
          protocol: "http",
          host: "localhost:3000",
          baseUrl: "/api/v1",
          authSignIn: "/auth/sign-in",
          authRefresh: "/auth/refresh",
          authSignOut: "/auth/sign-out",
      },

      templates = {
          SimpleTemplate,
          MiniPCPTemplate,
          Default: SimpleTemplate,
      },

      renderNodes = {
          dialog: "dialog-body",
          reportsIndex: "index-body",
          pageHeader: "page-header",
          reportContainer: "report-container",
          reportIFrame: "report-iframe",
          reportBody: "report-body",
          reportCloseButton: "report-close-button",
          reportPrintButton: "report-print-button",
      },

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

          renderNodes,
          templates,
          api,

          Modal,
          Dom,
          ReportsIndex,
          ReportParams,
          ReportDialog,
          Reporter,
      },

      baseContext = {
          ...independentContext,
          auth: Auth(independentContext),
      },

      authDialog = AuthDialog(baseContext),
      httpClient = HttpClient({ ...baseContext, authDialog }),

      context = {
          httpClient,
          authDialog,
          page: Page({ ...baseContext, httpClient }),
      };

export default context;
