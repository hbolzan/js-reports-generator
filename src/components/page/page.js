function Page(baseContext) {
    const { UIkit, document,  renderNodes, messageBroker, topics, MainIndex, ReportsIndex } = baseContext,
          self = {
              init,
              renderIndex,
              showReport: () => setReportContainerVisible(true),
              hideReport: () => {
                  setReportContainerVisible(false);
                  clearReportBody();
              },
              iFrameDocument,
          },
          context = { ...baseContext, page: self };

    function renderIndex(authData) {
        MainIndex(context)
            .index()
            .then(dom => dom.render(renderNodes.mainIndex));
    }

    function handleSignedIn(authData) {
        document.getElementById(renderNodes.userButton).classList.remove("uk-invisible");
        document.getElementById(renderNodes.userButtonNameContainer).innerHTML = authData.auth.username;
        renderIndex();
    }

    function handleSignedOut() {
        document.getElementById(renderNodes.userButton).classList.add("uk-invisible");
        document.getElementById(renderNodes.userButtonNameContainer).innerHTML = "";
    }

    function clearReportBody() {
        (iFrameDocument().getElementById(renderNodes.reportBody) || {})
            .innerHTML = "";
    }

    function setReportContainerVisible(state) {
        const el = document.getElementById(renderNodes.reportContainer);
        if ( el ) {
            el.hidden = ! state;
        }
    }

    function iFrameWindow() {
        const iframe = document.getElementById(renderNodes.reportIFrame);
        return (iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument);
    }

    function iFrameDocument() {
        return iFrameWindow().document;
    }

    function printReport() {
        const frameWindow = iFrameWindow();
        frameWindow.focus();
        frameWindow.print();
    }

    function setListeners() {
        messageBroker.listen(topics.AUTH__SIGNED_IN, handleSignedIn);
        messageBroker.listen(topics.AUTH__REFRESHED, handleSignedIn);
        messageBroker.listen(topics.AUTH__SIGNED_OUT, handleSignedOut);
        messageBroker.listen(topics.AUTH__UNAUTHORIZED, handleSignedOut);
    }

    function init() {
        if ( context.global.location.pathname === "/report.html" ) {
            return;
        }
        require("uikit/dist/css/uikit.min.css");
        require("js-datepicker/dist/datepicker.min.css");
        UIkit.sticky(document.getElementById(renderNodes.pageHeader));
        self.hideReport();
        document.getElementById(renderNodes.reportContainer).style = "";
        document.getElementById(renderNodes.reportCloseButton).onclick = self.hideReport;
        document.getElementById(renderNodes.reportPrintButton).onclick = printReport;
        document.getElementById("auth-sign-out").onclick = () => messageBroker.produce(
            topics.AUTH__SIGN_OUT_REQUESTED, { source: self }
        );
        setListeners();
        renderIndex();
    }

    return self;
}

export default Page;
