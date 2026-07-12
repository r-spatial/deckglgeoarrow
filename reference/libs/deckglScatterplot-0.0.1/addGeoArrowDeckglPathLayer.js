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
      deviceProps: {
        _cacheShaders: true,
        _cachePipelines: true,
      }
    });
    map.addControl(deckoverlay);
  }


  let data_fl = document.getElementById(opts.layerId + '-geoarrowWidget-attachment');

  fetch(data_fl.href)
    .then(result => {
      if (opts.extension_type === "arrow") {
        return Arrow.tableFromIPC(result);
      } else if (opts.extension_type === "parquet") {
        return window.parquet2arrow(result);
      } else {
        console.log("extension type not supported, need 'geoarrow' or 'geoparquet'");
      }
    })
    .then(arrow_table => {

      let pathlayer = pathLayer(map, opts, arrow_table);

     // does the mapboxoverlay already have layer(s)?
      if (deckoverlay._props.layers.length ===  0) {
        deckoverlay.setProps({ layers: [pathlayer] })
      } else {
        let lrs = deckoverlay._props.layers.concat(pathlayer);
        lrs = lrs.sort(function(a, b) {
          return a.props.zIndex - b.props.zIndex;
        });
        deckoverlay.setProps({ layers: lrs });
      }

    });

  map.on("projectiontransition", () => {
    deckoverlay._updateViewState();
  });

};

pathLayer = function(map, opts, table) {
  let gaDeckLayers = window["@geoarrow/deck"]["gl-layers"];

  let table_names = table.schema.fields.map(obj => obj.name);

  if (opts.popup === true) {
    opts.popup = table_names;
  }

  if (opts.tooltip === true) {
    opts.tooltip = table_names;
  }

  let layer = new gaDeckLayers.GeoArrowPathLayer({
    id: opts.decklayerId,
    data: table,
    getPath: table.getChild(opts.geom_column_name),
    getCursor: () => "inherit",
    beforeId: opts.renderOptions.beforeId,
    slot: opts.layerId,
    zIndex: opts.renderOptions.zIndex,

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

/*
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
*/
    getColor: opts.dataAccessors.getColor === null ? [0,0,0,255] : ({ index, data }) => {
      return colorAccessor(index, data, opts.dataAccessors.getColor);
    },

    getWidth: opts.dataAccessors.getWidth === null ? 1 : ({ index, data }) => {
      return attributeAccessor(index, data, opts.dataAccessors.getWidth);
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
          removePopups(opts.tooltipOptions.className);
        }
        let popup = clickFun(info, event, opts, "tooltip", opts.map_class);
        if (popup !== undefined) {
          popup.addTo(map);
        }
    },

  });

  return layer;

};
