# Add Deck.gl ScatterplotLayer to a [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html) or [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html) map using blazing fast [`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html) data transfer.

Add Deck.gl ScatterplotLayer to a
[`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
or
[`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
map using blazing fast
[`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html)
data transfer.

## Usage

``` r
addGeoArrowScatterplotLayer(
  map,
  data,
  file,
  url,
  layer_id = "scatter",
  geom_column_name = "geometry",
  popup = NULL,
  tooltip = NULL,
  render_options = renderOptions(),
  data_accessors = dataAccessors(),
  popup_options = popupOptions(),
  tooltip_options = tooltipOptions(),
  ...
)
```

## Arguments

- map:

  the
  [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
  or
  [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
  map to add the layer to.

- data:

  a sf `(MULTI)POINT` object.

- file:

  a valid local file path to a `geoarrow` or `geoparquet` file to be
  added to the map. Ignored if `data` is supplied.

- url:

  a URL to a remotely hosted `geoarrow` or `geoparquet` file to be added
  to the map. Ignored if `data` or `file` is supplied.

- layer_id:

  the layer id.

- geom_column_name:

  the name of the geometry column of the sf object. It is inferred
  automatically if only one is present.

- popup:

  should a popup be contructed? If `TRUE`, will create a popup fromm all
  available attributes of the feature. Can also be a character vector of
  column names, on which case the popup will include only those columns.
  If a single character is supplied, then this will be shown for all
  features. If `NULL` (deafult) or `FALSE`, no popup will be shown.

- tooltip:

  should a tooltip be contructed? If `TRUE`, will create a tooltip fromm
  all available attributes of the feature. Can also be a character
  vector of column names, on which case the tooltip will include only
  those columns. If a single character is supplied, then this will be
  shown for all features. If `NULL` (deafult) or `FALSE`, no tooltip
  will be shown.

- render_options:

  a list of
  [renderOptions](https://r-spatial.github.io/deckglgeoarrow/reference/renderOptions.md)

- data_accessors:

  a list of
  [dataAccessors](https://r-spatial.github.io/deckglgeoarrow/reference/dataAccessors.md)

- popup_options:

  a list of
  [popupOptions](https://r-spatial.github.io/deckglgeoarrow/reference/popupOptions.md)

- tooltip_options:

  a list of
  [tooltipOptions](https://r-spatial.github.io/deckglgeoarrow/reference/popupOptions.md)

- ...:

  can be used to pass additional props and parameters to the deck.gl
  instance. See Details for more info.

## Details

`...` can be used to pass additional props and parameters to the deck.gl
instance for fine-tuning rendering behaviour. For example, we can pass a
list called `parameters` with settings that control the GPU pipeline of
the deck.gl instance. See
<https://luma.gl/docs/api-reference/core/parameters> for a list of
available prarmeters.

By default, all deck.gl layers passed to a
[`maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
map will be drawn on top of existing ones. It is, however, possible to
inject layers into the existing `maplibre` (base) layer stack by using
`render_options = renderOptions(beforeId = "<some-existing-layer-id>")`
which will plot the current layer underneath
`"<some-existing-layer-id>"`. See below for an example.

## Examples

``` r
library(wk)
library(mapgl)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

m = maplibre(style = style_positron)

## single wk POINT
pt = wkt("POINT (0 0)")

m |>
  addGeoArrowScatterplotLayer(
    data = pt
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[]},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"scatter","popup":null,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1},"dataAccessors":{"getRadius":1,"getColor":[0,0,0,255],"getFillColor":[0,0,0,130],"getLineColor":[0,0,0,255],"getLineWidth":1,"getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"extension_type":"arrow"}}]}}
## wk POINT data frame
n = 5e3

pts = xy(
x = runif(n, -180, 180)
, y = runif(n, -50, 50)
, crs = 4326
)

dat = data.frame(
  id = 1:length(pts)
  , geometry = pts
)

dat$fillColor = sample(hcl.colors(n, alpha = sample(seq(0, 1, length.out = n))))
dat$lineColor = sample(
  hcl.colors(n, alpha = sample(seq(0, 1, length.out = n)), palette = "inferno")
)
dat$radius = sample.int(15, nrow(dat), replace = TRUE)
dat$lineWidth = sample.int(5, nrow(dat), replace = TRUE)

m = maplibre(
  style = style_positron
) |>
  add_navigation_control(visualize_pitch = TRUE) |>
  add_globe_control()

m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "my-scatter-layer"
    , geom_column_name = "geometry"
    , render_options = renderOptions()
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , popup = TRUE
    , popup_options = popupOptions(anchor = "bottom-right")
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(anchor = "top-left")
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"},"globe_control":{"position":"top-right"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"my-scatter-layer","popup":true,"tooltip":true,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1},"dataAccessors":{"getRadius":"radius","getColor":[0,0,0,255],"getFillColor":"fillColor","getLineColor":"lineColor","getLineWidth":"lineWidth","getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom-right","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"extension_type":"arrow"}}]}}
## same as above, but using `beforeId` to inject layer into base layer stack
m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "my-scatter-layer"
    , geom_column_name = "geometry"
    , render_options = renderOptions(beforeId = "water")
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , popup = TRUE
    , popup_options = popupOptions(anchor = "bottom-right")
    , tooltip = FALSE
    , tooltip_options = tooltipOptions(anchor = "top-left")
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"},"globe_control":{"position":"top-right"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"my-scatter-layer","popup":true,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":"water","zIndex":1},"dataAccessors":{"getRadius":"radius","getColor":[0,0,0,255],"getFillColor":"fillColor","getLineColor":"lineColor","getLineWidth":"lineWidth","getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom-right","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"extension_type":"arrow"}}]}}
## remote parquet file
m |>
  addGeoArrowScatterplotLayer(
    url = "https://raw.githubusercontent.com/geoarrow/geoarrow-data/v0.2.0/natural-earth/files/natural-earth_cities_native.parquet"
    , layer_id = "parquet-layer"
    , geom_column_name = "geometry"
    , data_accessors = dataAccessors(
      getRadius = 10
      , getFillColor = '#ff000090'
      , getLineColor = '#000000ff'
    )
    , tooltip = TRUE
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"},"globe_control":{"position":"top-right"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"parquet-layer","popup":null,"tooltip":true,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1},"dataAccessors":{"getRadius":10,"getColor":[0,0,0,255],"getFillColor":"#ff000090","getLineColor":"#000000ff","getLineWidth":1,"getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"extension_type":"parquet"}}]}}
```
