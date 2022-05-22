function CellRendererFactory(options) {
    const { event, eventHandler, eventHandlerName, content } = options,
          CellRenderer = new Function();

    function buildEGui() {
        const el = document.createElement("span");
        el.innerHTML = content;
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

function reviewColumnDef(columnDef) {
    if ( columnDef.customCellParams ) {
        return Object.assign(
            {},
            columnDef,
            {
                cellRenderer: CellRendererFactory({
                    ...columnDef.customCellParams,
                    eventHandlerName: `${ columnDef.field }CustomEventHandler`,
                    eventHandler: function () { console.log(this.params.value); },
                })
            }
        );
    }
    return columnDef;
}

function components(defs) {
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

function DataGrid({ Grid }, node, options) {

    console.log(options);
    const reviewedColumnDefs = options.columnDefs.map(reviewColumnDef),
          newOptions = Object.assign(
              {},
              options,
              {
                  columnDefs: reviewedColumnDefs,
                  components: components(reviewedColumnDefs),
              },
          );

    return new Grid(node, newOptions);
}

export default DataGrid;
