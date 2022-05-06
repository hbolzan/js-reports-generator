function Auth(context) {
    const data = {},
          { global, config, browserFingerprint, messageBroker, topics } = context,
          signInUrl = config.authUrl(config.api.authSignIn),
          refreshUrl = config.authUrl(config.api.authRefresh),
          storageName = getStorageName(browserFingerprint);

    function getStorageName(fingerPrint) {
        // JSRGAT - JS Reports Generator Auth Token
        const s = String(fingerPrint);
        return "jsrgat-" + s.slice(0, 2) + s.slice(-2);
    }

    function saveAuthData(data) {
        global.localStorage.setItem(storageName, JSON.stringify(data.auth));
        return data;
    }

    function getAuthData() {
        data.auth = JSON.parse(global.localStorage.getItem(storageName));
        return data;
    }

    function handleAuthentication(res, topic) {
        if ( res.status == 200 ) {
            data.auth = JSON.parse(res.headers.get("auth"));
            saveAuthData(data);
            refreshWhileYouCan(data);
            messageBroker.produce(topic, data);
        } else {
            messageBroker.produce(topics.AUTH__UNAUTHORIZED, {});
        }
    };

    function signIn(userName, password) {
        clearTimeout(data.timedRefresh);
        fetch(
            signInUrl,
            {
                method: "POST",
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password, fingerPrint: browserFingerprint })
            }
        ).then(r => handleAuthentication(r, topics.AUTH__SIGNED_IN));
    }

    function refresh() {
        const res = fetch(
            refreshUrl,
            {
                method: "POST",
                mode: "cors",
                headers: authorizationHeader(),
            }
        ).then(r => handleAuthentication(r, topics.AUTH__REFRESHED));
    }

    function signOut() {
        data.auth = {};
        saveAuthData(data);
        refresh();
        messageBroker.produce(topics.AUTH__SIGNED_OUT, {});
    }

    function refreshWhileYouCan(data) {
        clearTimeout(data.timedRefresh);
        if ( data?.auth?.expiresIn ) {
            data.timedRefresh = setTimeout(refresh, (data.auth.expiresIn-15)*1000);
        }
    }

    function authorizationHeader() {
        const data = getAuthData();
        return { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }` };
    }

    function GET(url) {
        const res = fetch(
            url,
            {
                cache: "no-cache",
                headers: { "Authorization": `Bearer ${ data?.auth?.token }::${ browserFingerprint }`}
            }
        );
        res.then(r => {
            data.lastResponse = r;
            r.json().then(j => data.lastBody = j);
        });
    }

    refresh();
    messageBroker.listen(topics.AUTH__SIGN_OUT_REQUESTED, signOut);

    return {
        signIn,
        refresh,
        authorizationHeader,
        GET,
    };
}

export default Auth;
