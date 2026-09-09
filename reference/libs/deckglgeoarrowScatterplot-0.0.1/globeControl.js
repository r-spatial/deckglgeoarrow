addGlobeControl = function(map, position) {
  if (window.maplibregl === undefined) {
    return;
  }
  let globecontrol = new maplibregl.GlobeControl({position: position});
  map.addControl(globecontrol);
  map.controls.push(globecontrol);
}
