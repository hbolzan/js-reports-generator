import definitionToSettings from "../../adapters/report.js";

const fetchOptions = {
    mode: "cors",
    errorMessage: "ATENÇÃO: O relatório selecionado não está disponível"
};

function Params(context, reportId) {
    const { httpClient, config, api } = context,
          paramsUrl = config.apiUrl(api.reportParams(reportId));

    let params,
        pending,
        state = "new";

    function localData() {
        return new Promise((resolve, reject) => resolve(params));
    }

    function updateParams(newParams) {
        params = newParams;
        state = "resolved";
        return params;
    }

    function fetchParams() {
        state = "pending";
        return httpClient.GET(paramsUrl, fetchOptions)
            .then(r => r.json())
            .then(p => updateParams({
                settings: definitionToSettings(p),
                dialogParams: p.dialogParams,
            }));
    }

    function getNew() {
        pending = fetchParams;
        return pending();
    }

    const getPending = () => {
        return pending();
    };

    const promises = {
        new: getNew,
        pending: getPending,
        resolved: localData,
    };

    const _get = () => {
        return promises[state]();
    };

    return {
        get: _get,
    };

}

const params = {};

function ReportParams(context, reportId) {
    if ( ! params[reportId] ) {
        params[reportId] = Params(context, reportId);
    }
    return params[reportId];
}

export default ReportParams;
