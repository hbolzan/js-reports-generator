function Features(context) {

    const cachedFeatures = {},
          { httpClient, config, api } = context,
          fetchOptions = {
              mode: "cors",
              errorMessage: "ATENÇÃO: A funcionalidade selecionada não está disponível"
          };

    async function fetch(featureId) {
        const featureUrl = config.apiUrl(api.feature(featureId));
        return await httpClient.GET(featureUrl, fetchOptions);
    }

    async function _get(featureId) {
        if ( ! cachedFeatures[featureId] ) {
            const response = await fetch(featureId);
            cachedFeatures[featureId] = response.json();
        }
        return cachedFeatures[featureId];
    }

    return {
        get: _get,
    };

}

export default Features;
