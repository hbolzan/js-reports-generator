function Params({ global, api }, reportId) {
    const paramsUrl = `${ api.protocol }://${ api.host }${ api.baseUrl }/reports/${ reportId }/params`;

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
        return global.fetch(paramsUrl, { method: "GET", mode: "cors" })
            .then(r => r.json())
            .then(p => updateParams(p));
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
