import { assocIf } from "../logic/misc.js";

function HttpClient({ _, auth, global, UIkit }) {
    const fetch = global.fetch;

    function validateResponse(response, errorMessage) {
        if ( response.status > 299 ) {
            UIkit.modal.alert(errorMessage || `Ocorreu um erro ao acessar o recurso ${ uri }`);
        }
        return response;
    }

    function requestOptions(baseOptions, { mode, body, headers }) {
        const options = [
            ["mode", mode],
            ["body", body ? JSON.stringify(body) : null ],
            ["headers", { ...(headers || {}), ...auth.authorizationHeader() }],
        ];
        return options.reduce((r, o) => assocIf(r, o[0], o[1]), baseOptions);
    }

    function request(method, uri, options) {
        return fetch(uri, requestOptions({ method }, options))
            .then(res => validateResponse(res, options.errorMessage));
    }

    const GET = _.partial(request, "GET"),
          POST = _.partial(request, "POST");

    return {
        GET,
        POST,
    };
}

export default HttpClient;
