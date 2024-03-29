function Page(baseContext) {
    const {
        UIkit,
        config,
        document,
        renderNodes,
        messageBroker,
        topics,
        httpClient,
        MainIndex,
        ReportsIndex
    } = baseContext,
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

    function showUserName(authData) {
        document.getElementById(renderNodes.userButton).classList.remove("uk-invisible");
        document.getElementById(renderNodes.userButtonNameContainer).innerHTML = authData.auth.username;
    }

    function handleSignedIn(authData) {
        showUserName(authData);
        renderIndex();
    }

    function handleRefreshed(authData) {
        showUserName(authData);
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
        if (el) {
            el.hidden = !state;
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
        messageBroker.listen(topics.AUTH__REFRESHED, handleRefreshed);
        messageBroker.listen(topics.AUTH__SIGNED_OUT, handleSignedOut);
        messageBroker.listen(topics.AUTH__UNAUTHORIZED, handleSignedOut);
    }

    function setPageProperties(backendVersion) {
        document.getElementById(renderNodes.versionContainer)
            .innerHTML = `FE-${config.version} + BE-${ backendVersion.version }`;
        document.getElementById(renderNodes.reportContainer).style = "";
        document.getElementById(renderNodes.reportCloseButton).onclick = self.hideReport;
        document.getElementById(renderNodes.reportPrintButton).onclick = printReport;
        document.getElementById(renderNodes.userSignOutMenu).onclick = () => messageBroker.produce(
            topics.AUTH__SIGN_OUT_REQUESTED, { source: self }
        );
        document.getElementById(renderNodes.userChangePasswordMenu).onclick = () => messageBroker.produce(
            topics.FEATURES__ACTIVATION_REQUESTED, { featureId: "change-password" }
        );
    }

    function init() {
        if (context.global.location.pathname === "/report.html") {
            return;
        }
        require("uikit/dist/css/uikit.min.css");
        require("ag-grid-community/styles/ag-grid.css");
        require("ag-grid-community/styles/ag-theme-alpine.css");
        require("js-datepicker/dist/datepicker.min.css");
        UIkit.sticky(document.getElementById(renderNodes.pageHeader));
        self.hideReport();
        httpClient.GET(config.api.version, { mode: "cors" }).then(r => r.json()).then(setPageProperties);
        setListeners();
        renderIndex();
    }

    return self;
}

export default Page;
