const ServerRenderedTemplate = (context, params) => {
    return {
        render: data => data,
        style: styleSheet(params.style),
    };
};

export default SimpleTemplate;
