addGeoArrowDeckglScatterplotLayer = function(map, opts) {

  // FIXME: turn into function for re-use across layer types
  // first we generate the proper internal layer name using the slot parameter
  opts.decklayerId = "deck-layer-group-slot:" + opts.layerId

  // then, if 'beforeId' is supplied we change accordingly. see
  // https://github.com/visgl/deck.gl/tree/master/modules/mapbox/src/resolve-layer-groups.ts#L13-L20
  if (opts.renderOptions.beforeId !== null) {
    opts.decklayerId = "deck-layer-group-before:" + opts.renderOptions.beforeId
  }

  // FIXME: turn into function for re-use across layer types
  // do we already have a deckgl mapboxoverlay on our map?
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

  // find the attached arrow data, fetch and inject into the mapboxoverlay
  let data_fl = document.getElementById(opts.layerId + '-geoarrowWidget-attachment');

  fetch(data_fl.href)
    .then(result => Arrow.tableFromIPC(result))
    .then(arrow_table => {

      let scatterlayer = scatterplotLayer(map, opts, arrow_table);
      // does the mapboxoverlay already have layer(s)?

      if (deckoverlay._props.layers.length ===  0) {
        deckoverlay.setProps({ layers: [scatterlayer] });
      } else {
        let lyrs = deckoverlay._props.layers.concat(scatterlayer);
        lyrs = lyrs.sort(function(a, b){return a.props.position - b.props.position});
        deckoverlay.setProps({ layers: lyrs });
      }

      // to reorder layers according to opts.renderOptions.position -> rename to zIndex
      //deckoverlay._props.layers.sort(function(a, b){return a.props.position - b.props.position})

    });

  map.on("projectiontransition", () => {
    deckoverlay._updateViewState();
  });

};


scatterplotLayer = function(map, opts, table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];

  let layer = new gaDeckLayers.GeoArrowScatterplotLayer({
    id: opts.decklayerId,
    data: table,
    getPosition: table.getChild(opts.geom_column_name),
    beforeId: opts.renderOptions.beforeId,
    slot: opts.layerId,
    position: opts.renderOptions.position,

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
