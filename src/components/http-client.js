import { assocIf } from "../logic/misc.js";

const UNAUTHORIZED = 401,
      OK = 200,
      ERROR = 999;

function HttpClient(context) {
    const { _, auth, authDialog, global, UIkit } = context,
          fetch = global.fetch,
          responseActions = {
              [OK]: (uri, res) => res,
              [ERROR]: (uri, res, errorMessage) => {
                  UIkit.modal.alert(errorMessage || `Ocorreu um erro ao acessar o recurso ${ uri }`);
                  return res;
              },
              [UNAUTHORIZED]: (uri, res) => {
                  authDialog.dialog();
                  return res;
              }
          };

    function statusToError(status) {
        return ( status == 200 ) ? OK :
            (( status == 401 ) ? UNAUTHORIZED : ERROR );
    }

    function validateResponse(uri, response, errorMessage) {
        const action = responseActions[statusToError(response.status)];
        return action(uri, response, errorMessage);
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
            .then(res => validateResponse(uri, res, options.errorMessage));
    }

    const GET = _.partial(request, "GET"),
          POST = _.partial(request, "POST");

    return {
        GET,
        POST,
    };
}

export default HttpClient;
