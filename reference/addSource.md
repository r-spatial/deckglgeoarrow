# Add a data source to a [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html) or [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html) map.

Add a data source to a
[`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
or
[`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
map.

## Usage

``` r
addSource(map, id, data, file, url, ...)
```

## Arguments

- map:

  the
  [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
  or
  [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
  map to add the data source to.

- id:

  a unique `ID` for the data source.

- data:

  a `sf`, `wk`, `geos` or `SpatVector` object.

- file:

  a valid local file path to a `geoarrow` or `geoparquet` file to be
  added to the map. Ignored if `data` is supplied.

- url:

  a URL to a remotely hosted `geoarrow` or `geoparquet` file to be added
  to the map. Ignored if `data` or `file` is supplied.

- ...:

  currently not used.

## Value

The modified `map` object with the added data source attached.

## Details

See
[`geoarrowWidget::attachData()`](https://r-spatial.github.io/geoarrowWidget/reference/attachData.html)
for details.

## Examples

``` r
library(mapgl)
library(wk)

pt = wkt("POINT (0 0)")

m = maplibre()

m = m |>
  addSource(
    id = "pt"
    , data = pt
  ) |>
  addGeoArrowScatterplotLayer(source = "pt")

## open the map in the browser, press <Ctrl+u> and look for a line like this:
## <link id="pt-geoarrowWidget-attachment" rel="attachment" href="lib/pt-0.0.1/pt.arrow"/>
m

{"x":{"style":"https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[]},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"pt","popup":null,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1},"dataAccessors":{"getRadius":null,"getColor":null,"getFillColor":null,"getLineColor":null,"getLineWidth":null,"getElevation":null,"getWidth":null},"popupOptions":{"anchor":"bottom","className":"deckglgeoarrow-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"deckglgeoarrow-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"pickable":false}}]}}
```
