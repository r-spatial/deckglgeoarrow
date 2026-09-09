# Add Deck.gl S2Layer to a [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html) or [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html) map using blazing fast [`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html) data transfer.

Add Deck.gl S2Layer to a
[`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
or
[`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
map using blazing fast
[`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html)
data transfer.

## Usage

``` r
addGeoArrowS2Layer(
  map,
  data,
  source,
  file,
  url,
  layer_id = "s2",
  s2_column_name = "s2_cells",
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

  a `sf`, `wk`, `geos` or `SpatVector` `(MULTI)POLYGON` object. Ignored
  if `source` is supplied.

- source:

  the `id` of a source previously added via
  [`addSource()`](https://r-spatial.github.io/deckglgeoarrow/reference/addSource.md).

- file:

  a valid local file path to a `geoarrow` or `geoparquet` file to be
  added to the map. Ignored if `source` or `data` is supplied.

- url:

  a URL to a remotely hosted `geoarrow` or `geoparquet` file to be added
  to the map. Ignored if `source` or `data` or `file` is supplied.

- layer_id:

  the layer id.

- s2_column_name:

  the name of the S2 cells column of the data object.

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

## Value

The modified `map` object with the added polygon layer.

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
library(s2)
library(mapgl)

## global coverage at S2 level 3
n = 1e5

pts = data.frame(
  id = seq_len(n)
  , geometry = xy(
    x = runif(n, -180, 180)
    , y = runif(n, -90, 90)
    , crs = 4326
  )
)

pts$s2cell = as_s2_cell(pts$geometry)
pts$s2parent_l4 = as.character(s2_cell_parent(pts$s2cell, level = 3))
pts$s2cell = as.character(pts$s2cell)

sbs = pts[!duplicated(pts$s2parent_l4), ]

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

m = maplibre(style = style_positron)

m |>
  addGeoArrowS2Layer(
    data = sbs
    , layer_id = "s2layer"
    , s2_column_name = "s2parent_l4"
    , data_accessors = dataAccessors(
      getFillColor = "#74aa2380"
      , getLineColor = "#4523bb"
      , getLineWidth = 2
    ),
    render_options = renderOptions(
      autoHighlight = TRUE
    )
  ) |>
  set_view(c(0, 0), 2) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE)

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"setCenter":[0,0],"setZoom":2,"globe_control":{"position":"top-right"},"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglS2Layer(map, data);\n      }","data":{"s2_column_name":"s2parent_l4","layerId":"s2layer","popup":null,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1,"autoHighlight":true,"highlightColor":[0,0,128,128]},"dataAccessors":{"getRadius":null,"getColor":null,"getFillColor":"#74aa2380","getLineColor":"#4523bb","getLineWidth":2,"getElevation":null,"getWidth":null},"popupOptions":{"anchor":"bottom","className":"deckglgeoarrow-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"deckglgeoarrow-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"pickable":true}}]}}
## S2 hierarchy for one point
dat = data.frame(
  token = as.character(
    s2_cell_parent(
      as_s2_cell(
        s2_lnglat(-75.7019612, 45.4186427)
      )
      , level = 1:30
    )
  )
  , elevation = seq(10, 1000, length.out = 30)
  , fillColor = hcl.colors(30, palette = "inferno", alpha = 0.1)
)

m = maplibre()

m |>
  addGeoArrowS2Layer(
    data = dat
    , layer_id = "s2layer"
    , s2_column_name = "token"
    , render_options = renderOptions(
      extruded = TRUE
      , wireframe = TRUE
    )
    , data_accessors = dataAccessors(
      getFillColor = "fillColor"
      , getElevation = "elevation"
    )
  ) |>
  set_view(c(-45, 45), 1) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE)

{"x":{"style":"https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"setCenter":[-45,45],"setZoom":1,"globe_control":{"position":"top-right"},"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglS2Layer(map, data);\n      }","data":{"s2_column_name":"token","layerId":"s2layer","popup":null,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":true,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1,"autoHighlight":false,"highlightColor":[0,0,128,128]},"dataAccessors":{"getRadius":null,"getColor":null,"getFillColor":"fillColor","getLineColor":null,"getLineWidth":null,"getElevation":"elevation","getWidth":null},"popupOptions":{"anchor":"bottom","className":"deckglgeoarrow-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"deckglgeoarrow-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"pickable":false}}]}}
```
