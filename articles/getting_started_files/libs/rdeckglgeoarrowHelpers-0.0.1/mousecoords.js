addMouseCoordinates = function(el, map, css) {

  function addMCStrip () {
    var newDiv = document.createElement('div');
    // append at end of htmlwidget container
    el.append(newDiv);
    //provide ID and style
    newDiv.class = '.lnlt';
    newDiv.id = 'lnlt';
    Object.assign(newDiv.style, css);
    return newDiv;
  }

  function getMouseCoords (e) {
    let lng = e.lngLat.lng;
    if (lng > 180) {
      lng = -360 + parseFloat(lng);
    }
    if (lng < -180) {
      lng = 360 + parseFloat(lng);
    }
    let txt = ' lon: ' + lng.toFixed(5) +
      ' | lat: ' + (e.lngLat.lat).toFixed(5) +
      ' | zoom: ' + map.getZoom().toFixed(3) + ' ';

    return txt;
  }

  map.on('mousemove', function (e) {
    let txt_coords = getMouseCoords(e);
    if (document.getElementById('lnlt') === null) {
     let lnlt = addMCStrip();
    }
    lnlt.innerHTML = txt_coords;
  });

  // remove the lnlt div when mouse leaves map
  map.on('mouseout', function (e) {
    var strip = document.getElementById('lnlt');
    if( strip !== null) strip.remove();
  });

};
