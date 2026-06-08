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
  data = NULL,
  url = NULL,
  layer_id = "scatter",
  geom_column_name = attr(data, "sf_column"),
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

- url:

  a URL to a remotely hosted `geoarrow` or `geoparquet` file to be added
  to the map. Ignored if `data` is supplied.

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
inject layers into existing `maplibre` layers by passing
`interleaved = TRUE` via `...`. In combination with a
`render_options = renderOptions(beforeId = "<some-existing-layer-id>")`
this will plot the current layer underneath
`"<some-existing-layer-id>"`.

## Examples

``` r
library(mapgl)
library(sf)
#> Linking to GEOS 3.12.1, GDAL 3.8.4, PROJ 9.4.0; sf_use_s2() is TRUE

n = 5e3
dat = data.frame(
  id = 1:n
  , x = runif(n, -180, 180)
  , y = runif(n, -60, 60)
)
dat = st_as_sf(
  dat
  , coords = c("x", "y")
  , crs = 4326
)
dat$fillColor = sample(hcl.colors(n, alpha = sample(seq(0, 1, length.out = n))))
dat$lineColor = sample(
  hcl.colors(n, alpha = sample(seq(0, 1, length.out = n)), palette = "inferno")
)
dat$radius = sample.int(15, nrow(dat), replace = TRUE)
dat$lineWidth = sample.int(5, nrow(dat), replace = TRUE)

m = maplibre(
  style = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
) |>
  add_navigation_control(visualize_pitch = TRUE) |>
  add_globe_control()

m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "test"
    , geom_column_name = attr(dat, "sf_column")
    , render_options = renderOptions()
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , popup = TRUE
    , popup_options = popupOptions(anchor = "bottom-right")
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(anchor = "top-left")
  )
#> Loading required namespace: geoarrow

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"},"globe_control":{"position":"top-right"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"test","popup":true,"tooltip":true,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null},"dataAccessors":{"getRadius":"radius","getColor":[0,0,0,255],"getFillColor":"fillColor","getLineColor":"lineColor","getLineWidth":"lineWidth","getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom-right","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"map_class":"maplibregl","interleaved":true,"extension_type":"arrow","parameters":{"depthCompare":"always","cullMode":"back"}}}]}}
## interleaved example
m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "test"
    , geom_column_name = attr(dat, "sf_column")
    , interleaved = TRUE
    , render_options = renderOptions(beforeId = "boundary_county")
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , popup = TRUE
    , popup_options = popupOptions(anchor = "bottom-right")
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(anchor = "top-left")
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[],"navigation_control":{"show_compass":true,"show_zoom":true,"visualize_pitch":true,"position":"top-right","orientation":"vertical"},"globe_control":{"position":"top-right"}},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglScatterplotLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"test","popup":true,"tooltip":true,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":"boundary_county"},"dataAccessors":{"getRadius":"radius","getColor":[0,0,0,255],"getFillColor":"fillColor","getLineColor":"lineColor","getLineWidth":"lineWidth","getElevation":1000,"getWidth":1},"popupOptions":{"anchor":"bottom-right","className":"geoarrow-deckgl-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"geoarrow-deckgl-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"map_class":"maplibregl","interleaved":true,"extension_type":"arrow","parameters":{"depthCompare":"always","cullMode":"back"}}}]}}
```
