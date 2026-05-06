addGeoArrowDeckglScatterplotLayer = function(map, opts) {

  opts.decklayerId = "deck-layer-group-slot:" + opts.layerId

  if (opts.renderOptions.beforeId !== null) {
    opts.decklayerId = "deck-layer-group-before:" + opts.renderOptions.beforeId
  }

  decklayer = map._controls.find((el) => el.hasOwnProperty("_deck"))

  if (decklayer === undefined) {
    decklayer = new deck.MapboxOverlay({
      id: "geoarrow-deck-layer",
      interleaved: opts.interleaved,
      layers: [],
    });
    map.addControl(decklayer);
  }


  let data_fl = document.getElementById(opts.layerId + '-geoarrowWidget-attachment');

  fetch(data_fl.href)
    .then(result => Arrow.tableFromIPC(result))
    .then(arrow_table => {

      let scatterlayer = scatterplotLayer(map, opts, arrow_table);
      // decklayer.setProps({layers: scatterlayer});
      if (decklayer._props.layers.length === undefined || decklayer._props.layers.length > 0) {
        decklayer.setProps({ layers: [decklayer._props.layers, scatterlayer] })
      } else {
        decklayer.setProps({ layers: scatterlayer })
      }

    });

  map.on("projectiontransition", () => {
    decklayer._updateViewState();
  });

};


scatterplotLayer = function(map, opts, table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];

  let layer = new gaDeckLayers.GeoArrowScatterplotLayer({
    id: opts.layerId,
    data: table,
    getPosition: table.getChild(opts.geom_column_name),
    beforeId: opts.renderOptions.beforeId,
    slot: opts.layerId,

    // render options
    radiusUnits: opts.renderOptions.radiusUnits,
    radiusScale: opts.renderOptions.radiusScale,
    lineWidthUnits: opts.renderOptions.lineWidthUnits,
    lineWidthScale: opts.renderOptions.lineWidthScale,
    stroked: opts.renderOptions.stroked,
    filled: opts.renderOptions.filled,
    radiusMinPixels: opts.renderOptions.radiusMinPixels,
    radiusMaxPixels: opts.renderOptions.radiusMaxPixels,
    lineWidthMinPixels: opts.renderOptions.lineWidthMinPixels,
    lineWidthMaxPixels: opts.renderOptions.lineWidthMaxPixels,
    billboard: opts.renderOptions.billboard,
    antialiasing: opts.renderOptions.antialiasing,

    // data accessros
    getRadius: ({ index, data }) =>
      attributeAccessor(index, data, opts.dataAccessors.getRadius),
    getFillColor: ({ index, data }) =>
      colorAccessor(index, data, opts.dataAccessors.getFillColor),
    getLineColor: ({ index, data }) =>
      colorAccessor(index, data, opts.dataAccessors.getLineColor),
    getLineWidth: ({ index, data }) =>
      attributeAccessor(index, data, opts.dataAccessors.getLineWidth),

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
      //debugger;
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
