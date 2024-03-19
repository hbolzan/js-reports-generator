import { _, toHtml } from "../../logic/hiccup.js";

Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const futureDate = days => (new Date()).addDays(days);

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

    function overlayLoadingTemplate() {
        return `
        <div class="uk-card uk-body">
            <div class="uk-align-center uk-grid-small uk-child-width-auto uk-margin" uk-grid uk-countdown="date: ${futureDate(1)}">
                <div><div class="uk-countdown-number uk-countdown-seconds"></div></div>
            </div>
            <p>Calculando. Essa operação pode demorar um pouco. Por favor, aguarde...</p>
            <div uk-spinner></div>
        </div>`;
    };

    const gridOptions = {
        ...options.gridOptions,
        overlayLoadingTemplate: overlayLoadingTemplate(),
    };
    const reviewedColumnDefs = gridOptions.columnDefs.map(reviewColumnDef),
          newOptions = Object.assign(
              {},
              _.omit(gridOptions, ["loading"]),
              {
                  columnDefs: reviewedColumnDefs,
                  components: gridComponents(reviewedColumnDefs),
              },
          );
    const grid = Grid.createGrid(node, newOptions);
    node.attributes.getGrid = () => grid;
    if (gridOptions.loading) {
        grid.showLoadingOverlay();
    }
    return grid;
}

export default DataGrid;
