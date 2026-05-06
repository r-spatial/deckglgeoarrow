addGeoArrowDeckglPathLayer = function(map, opts) {

  opts.decklayerId = "deck-layer-group-slot:" + opts.layerId

  if (opts.renderOptions.beforeId !== null) {
    opts.decklayerId = "deck-layer-group-before:" + opts.renderOptions.beforeId
  }

  deckoverlay = map._controls.find((el) => el.hasOwnProperty("_deck"))

  if (deckoverlay === undefined) {
    deckoverlay = new deck.MapboxOverlay({
      id: "geoarrow-deck-layer",
      interleaved: opts.interleaved,
      layers: [],
      getCursor: ({ isHovering }) => (isHovering ? 'pointer' : 'grab'),
    });
    map.addControl(deckoverlay);
  }


  let data_fl = document.getElementById(opts.layerId + '-geoarrowWidget-attachment');

  fetch(data_fl.href)
    .then(result => Arrow.tableFromIPC(result))
    .then(arrow_table => {

      let pathlayer = pathLayer(map, opts, arrow_table);

      if (deckoverlay._props.layers.length === undefined || deckoverlay._props.layers.length > 0) {
        deckoverlay.setProps({ layers: [deckoverlay._props.layers, pathlayer] })
      } else {
        deckoverlay.setProps({ layers: pathlayer })
      }

    });

  map.on("projectiontransition", () => {
    deckoverlay._updateViewState();
  });

};

pathLayer = function(map, opts, arrow_table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];

  let layer = new gaDeckLayers.GeoArrowPathLayer({
    id: opts.layerId,
    data: arrow_table,
    getPath: arrow_table.getChild(opts.geom_column_name),
    getCursor: () => "inherit",
    beforeId: opts.renderOptions.beforeId,
    slot: opts.layerId,

    // render options
    widthUnits: opts.renderOptions.widthUnits,
    widthScale: opts.renderOptions.widthScale,
    widthMinPixels: opts.renderOptions.widthMinPixels,
    widthMaxPixels: opts.renderOptions.widthMaxPixels,
    capRounded: opts.renderOptions.capRounded,
    jointRounded: opts.renderOptions.jointRounded,
    billboard: opts.renderOptions.billboard,
    miterLimit: opts.renderOptions.miterLimit,
    // _pathType: opts.renderOptions._pathType,

    // data accessros
    getColor: ({ index, data }) => {
      if (typeof(opts.dataAccessors.getColor) === "string") {
        const recordBatch = data.data;
        return hexToRGBA(recordBatch.get(index)[opts.dataAccessors.getColor]);
      } else {
        return opts.dataAccessors.getColor;
      }
    },
    getWidth: ({ index, data }) => {
      if (typeof(opts.dataAccessors.getWidth) === "string") {
        const recordBatch = data.data;
        return recordBatch.get(index)[opts.dataAccessors.getWidth];
      } else {
        return opts.dataAccessors.getWidth;
      }
    },

    // interactivity
    pickable: true,

    // GPU parameters (from luma.gl)
    // see https://luma.gl/docs/api-reference/core/parameters for valid params
    // this is currently mainly used to set 'depthCompare: "always"' to avoid
    // z-fighting rendering issues. Passed via ... from R currently.
    // (see https://github.com/developmentseed/lonboard/issues/1037)
    parameters: opts.parameters,

    onClick: (info, event) => {
        let popup = clickFun(info, event, opts, "popup", opts.map_class);
        if (popup !== undefined) {
          popup.addTo(map);
        }
    },

    onHover: (info, event) => {
        if (info.picked === false) {
          removePopups("geoarrow-deckgl-tooltip");
        }
        let popup = clickFun(info, event, opts, "tooltip", opts.map_class);
        if (popup !== undefined) {
          popup.addTo(map);
        }
    },

  });

  return layer;

};
