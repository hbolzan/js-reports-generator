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

    function iFrameDocument() {
        const container = document.getElementById(renderNodes.reportContainer);
        return container.contentWindow || container.contentDocument.document || container.contentDocument;
    }

    function init() {
        if ( context.global.location.pathname === "/report.html" ) {
            return;
        }
        UIkit.sticky(document.getElementById(renderNodes.pageHeader));
        self.hideReport();
        document.getElementById(renderNodes.reportContainer).style = "";
        document.getElementById(renderNodes.reportCloseButton).onclick = self.hideReport;
        renderIndex();
    }

    return self;
}

export default Page;
