addGeoArrowDeckglPolygonLayer = function(map, opts) {

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

      let polygonlayer = polygonLayer(map, opts, arrow_table);
      // does the mapboxoverlay already have layer(s)?
      /*
      if (deckoverlay._props.layers.length ===  0) {
        deckoverlay.setProps({ layers: [polygonlayer] })
      } else {*/
        deckoverlay.setProps({ layers: deckoverlay._props.layers.concat(polygonlayer) });
      //}

    });

  map.on("projectiontransition", () => {
    deckoverlay._updateViewState();
  });

};


polygonLayer = function(map, opts, table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];

  let layer = new gaDeckLayers.GeoArrowPolygonLayer({
    id: opts.layerId,
    data: table,
    getPolygon: table.getChild(opts.geom_column_name),
    beforeId: opts.renderOptions.beforeId,
    slot: opts.layerId,

    // render options
    filled: opts.renderOptions.filled,
    stroked: opts.renderOptions.stroked,
    extruded: opts.renderOptions.extruded,
    wireframe: opts.renderOptions.wireframe,
    elevationScale: opts.renderOptions.elevationScale,
    lineWidthUnits: opts.renderOptions.lineWidthUnits,
    lineWidthScale: opts.renderOptions.lineWidthScale,
    lineWidthMinPixels: opts.renderOptions.lineWidthMinPixels,
    lineWidthMaxPixels: opts.renderOptions.lineWidthMaxPixels,
    lineJointRounded: opts.renderOptions.lineJointRounded,
    lineMiterLimit: opts.renderOptions.lineMiterLimit,
    /*
    material: opts.renderOptions.material,
    _normalize: opts.renderOptions._normalize,
    _windingOrder: opts.renderOptions._windingOrder,
    //https://deck.gl/docs/developer-guide/performance#supply-attributes-directly
    */

    // data accessros
    getFillColor: ({ index, data }) =>
      colorAccessor(index, data, opts.dataAccessors.getFillColor),
    getLineColor: ({ index, data }) =>
      colorAccessor(index, data, opts.dataAccessors.getLineColor),
    getLineWidth: ({ index, data }) =>
      attributeAccessor(index, data, opts.dataAccessors.getLineWidth),
    getElevation: ({ index, data }) =>
      attributeAccessor(index, data, opts.dataAccessors.getElevation),

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
