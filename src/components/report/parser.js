
function ReportParser(context, template, reportDefinition) {

    function parse(data) {
        // parse
    }

    function render(data) {
        return context.Dom(context, parse(data));
    }

    return {
        render,
    };
}

export default ReportParser;
