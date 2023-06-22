import { toHtml } from "../../logic/hiccup.js";

function CellRendererFactory(context, options) {
    const { _, uuidGen, document } = context,
          { event, eventHandler, eventHandlerName, content } = options,
          CellRenderer = new Function();

    function buildEGui() {
        const el = document.createElement("span");
        el.innerHTML = _.isArray(content) ? toHtml(content, uuidGen) : content;
        return el;
    }

    CellRenderer.prototype.init = function(params) {
        const eGui = buildEGui(),
              boundEventHandler = eventHandler.bind(this);
        eGui.addEventListener(event, boundEventHandler);

        Object.assign(
            this,
            {
                params,
                eGui,
                [eventHandlerName]: boundEventHandler,
            }
        );
    };

    CellRenderer.prototype.getGui = function() {
        return this.eGui;
    };

    CellRenderer.prototype.destroy = function() {
        this.eGui.removeEventListener(event, this[eventHandlerName]);
    };

    return CellRenderer;
}

function DataGrid(context, node, options) {
    const { _, Grid } = context;

    function reviewColumnDef(columnDef) {
        if ( columnDef.customCellParams ) {
            const eventHandlerName = `${columnDef.field }CustomEventHandler`;

            return {
                ..._.omit(columnDef, "customCellParams"),
                cellRenderer: CellRendererFactory(
                    context,
                    {
                        ...columnDef.customCellParams,
                        eventHandlerName,
                        eventHandler: function () { console.log(eventHandlerName, this.params.value); },
                    }
                ),
            };
        }
        return columnDef;
    }

    function gridComponents(defs) {
        return defs.reduce(
            (comps, def) => {
                return {
                    ...comps,
                    ...(def.eventHandlerName ? { [def.eventHandlerName]: def.eventHandler } : {})
                };
            },
            {}
        );
    }

    const gridOptions = options.gridOptions;
    const reviewedColumnDefs = gridOptions.columnDefs.map(reviewColumnDef),
          newOptions = Object.assign(
              {},
              gridOptions,
              {
                  columnDefs: reviewedColumnDefs,
                  components: gridComponents(reviewedColumnDefs),
              },
          );
    return new Grid(node, newOptions);
}

export default DataGrid;
