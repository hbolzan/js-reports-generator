function Reporter(context, template, reportDefinition) {

    function report(data) {
        return context.Dom(context, template.render(data), template.style);
    }

    return {
        report,
    };
}

export default Reporter;
