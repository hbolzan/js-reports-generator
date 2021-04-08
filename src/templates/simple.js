import { tHead, tFoot, tBody } from "./helpers.js";

const emptyThClass = "empty-th";

const SimpleTemplate = params => {
    return {
        render: data => ["section",
                          ["header",
                           "h3", params.title],
                          ["table",
                           tHead(data, emptyThClass),
                           tBody(data),
                           tFoot(data, emptyThClass),]
                          ["footer",
                           ["h4", params.footer]]],

        style: params.style,
    };
};

export default SimpleTemplate;
