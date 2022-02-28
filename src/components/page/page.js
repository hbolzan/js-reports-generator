function Page(baseContext) {
    const { UIkit, document, renderNodes } = baseContext,
          self = {
              init,
              showReport: () => setReportContainerVisible(true),
              hideReport: () => setReportContainerVisible(false),
              iFrameDocument,
          },
          context = { ...baseContext, page: self };

    function renderIndex() {
        context.ReportsIndex(context)
            .index()
            .then(dom => dom.render(renderNodes.reportsIndex));
    }

    function setReportContainerVisible(state) {
        document.getElementById(renderNodes.reportContainer).hidden = ! state;
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
        renderIndex();
    }

    return self;
}

export default Page;
