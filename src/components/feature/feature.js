function Feature(context) {

    const cachedFeatures = {},
          { httpClient, config, api } = context,
          fetchOptions = {
              mode: "cors",
              errorMessage: "ATENÇÃO: A funcionalidade selecionada não está disponível"
          };

    async function fetchFeature(featureId) {
        const featureUrl = config.apiUrl(api.feature(featureId));
        return await httpClient.GET(featureUrl, fetchOptions);
    }

    async function feature(featureId) {
        if ( ! cachedFeatures[featureId] ) {
            const response = await fetchFeature(featureId);
            cachedFeatures[featureId] = response.json();
        }
        return cachedFeatures[featureId];
    }

    return {
        get: feature,
    };

}

export default Feature;
