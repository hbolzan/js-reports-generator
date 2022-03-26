const config = {

    api: {
        protocol: "http",
        host: "localhost:3000",
        baseUrl: "/api/v1",
        authSignIn: "/auth/sign-in",
        authRefresh: "/auth/refresh",
        authSignOut: "/auth/sign-out",
    },

    renderNodes: {
        dialog: "dialog-body",
        reportsIndex: "index-body",
        pageHeader: "page-header",
        reportContainer: "report-container",
        reportIFrame: "report-iframe",
        reportBody: "report-body",
        reportCloseButton: "report-close-button",
        reportPrintButton: "report-print-button",
    },

    topics: {
        AUTH__SIGNED_IN: "AUTH.SIGNED-IN",
        AUTH__SIGNED_OUT: "AUTH.SIGNED-OUT",
        AUTH__REFRESHED: "AUTH.REFRESHED",
        AUTH__SIGN_OUT_REQUESTED: "AUTH.SIGN-OUT-REQUESTED",
        AUTH__UNAUTHORIZED: "AUTH.UNAUTHORIZED",
    }
};

export default config;
