addGeoArrowDeckglPointCloudLayer = function(map, opts) {

  let data_fl = document.getElementById(opts.layerId + '-1-attachment');

  fetch(data_fl.href)
    .then(result => Arrow.tableFromIPC(result))
    .then(arrow_table => {
      let geoArrowPointCloud = pointCloudLayer(map, opts, arrow_table);

      var decklayer = new deck.MapboxOverlay({
        interleaved: false,
        layers: [geoArrowPointCloud],
      });
      map.addControl(decklayer);

    });
};


pointCloudLayer = function(map, opts, arrow_table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];
debugger;
  let layer = new gaDeckLayers.GeoArrowPointCloudLayer({
    id: opts.layerId,
    data: arrow_table,
    getPosition: arrow_table.getChild(opts.geom_column_name),

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
