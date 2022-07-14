function Config({ _, templates }) {
    function host() {
        const parts = window.location.href.split("//");
        return `${ parts[0] }//${ parts[1].split("/")[0] }`;
    }

    const settings = {

        templates,

        api: {
            host: host(),
            baseUrl: "/api/v1",
            authBaseUrl: "/auth",
            authSignIn: "sign-in",
            authRefresh: "refresh",
            reports: "reports",
            features: "features",
            actions: "actions",
            reportParams: reportId => `reports/${ reportId }/params`,
            feature: featureId => `features/${ featureId }`,
            actionGet: (actionId, param) => `actions/${ actionId }/${ param }`,
            actionPerform: (actionId) => `actions/${ actionId }`,
        },

        renderNodes: {
            dialog: "dialog-body",
            mainIndex: "index-body",
            mainIndexReportsTab: "main-index-reports-tab",
            mainIndexFeaturesTab: "main-index-features-tab",
            pageHeader: "page-header",
            reportContainer: "report-container",
            reportIFrame: "report-iframe",
            reportBody: "report-body",
            featuresBody: "features-body",
            reportCloseButton: "report-close-button",
            reportPrintButton: "report-print-button",
            userButton: "user-button",
            userButtonNameContainer: "user-button-name-container",
            userSignOutMenu: "user-menu-auth-sign-out",
            userChangePasswordMenu: "user-menu-change-password",
            versionContainer: "version-container",
        },

        topics: {
            AUTH__SIGNED_IN: "AUTH.SIGNED-IN",
            AUTH__SIGNED_OUT: "AUTH.SIGNED-OUT",
            AUTH__REFRESHED: "AUTH.REFRESHED",
            AUTH__SIGN_OUT_REQUESTED: "AUTH.SIGN-OUT-REQUESTED",
            AUTH__REFRESH_REQUESTED: "AUTH.REFRESH-REQUESTED",
            AUTH__UNAUTHORIZED: "AUTH.UNAUTHORIZED",

            FEATURES__ACTIVATION_REQUESTED: "FEATURES.ACTIVATION_REQUESTED",
        },
    };

    const version = '220506-1',
          authUrl = (resource) => `${ settings.api.host }${ settings.api.authBaseUrl }/${ resource }`,
          apiUrl = (resource) => `${ settings.api.host }${ settings.api.baseUrl }/${ resource }`;

    return {
        ...settings,
        version,
        authUrl,
        apiUrl,
    };
}

export default Config;
