appendStableGeoArrowLayer = function(deckoverlay, layer) {
  const existing = deckoverlay._props.layers || [];
  if (existing.some(candidate => candidate.props.id === layer.props.id)) {
    return false;
  }

  const layers = existing.concat([layer]).sort(
    (left, right) => left.props.zIndex - right.props.zIndex
  );
  deckoverlay.setProps({layers: layers});
  return true;
};

progressiveGeoArrowLayers = async function(deckoverlay, url, opts, layerFactory) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }

  const reader = await Arrow.RecordBatchReader.from(response.body);
  let index = 0;
  for await (const batch of reader) {
    const id = `${opts.layerId}-${index}`;
    appendStableGeoArrowLayer(deckoverlay, layerFactory(batch, id));
    index += 1;
  }
};

loadGeoArrowLayers = async function(deckoverlay, url, opts, layerFactory) {
  if (opts.extension_type === "arrow") {
    return progressiveGeoArrowLayers(deckoverlay, url, opts, layerFactory);
  }

  const response = await fetch(url);
  const table = await parse2ArrowTable(response, opts.extension_type);
  if (table === null) return;

  table.batches.forEach((batch, index) => {
    const id = `${opts.layerId}-${index}`;
    appendStableGeoArrowLayer(deckoverlay, layerFactory(batch, id));
  });
};
