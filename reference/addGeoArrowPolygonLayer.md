# Add Deck.gl PolygonLayer to a [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html) or [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html) map using blazing fast [`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html) data transfer.

Add Deck.gl PolygonLayer to a
[`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
or
[`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
map using blazing fast
[`nanoarrow::write_nanoarrow()`](https://arrow.apache.org/nanoarrow/latest/r/reference/read_nanoarrow.html)
data transfer.

## Usage

``` r
addGeoArrowPolygonLayer(
  map,
  data,
  file,
  url,
  layer_id = "polygon",
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

  a sf `(MULTI)POLYGON` object.

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
library(mapgl)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

m = maplibre(style = style_positron)

## single wk POLYGON
pl = wkt("POLYGON ((30 10, 10 30, 40 40, 30 10))")

m |>
  addGeoArrowPolygonLayer(
    data = pl
    , render_options = renderOptions(
      beforeId = "water"
    )
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[]},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglPolygonLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"polygon","popup":null,"tooltip":null,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":"water","zIndex":1},"dataAccessors":{"getRadius":null,"getColor":null,"getFillColor":null,"getLineColor":null,"getLineWidth":null,"getElevation":null,"getWidth":null},"popupOptions":{"anchor":"bottom","className":"deckglgeoarrow-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"deckglgeoarrow-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"pickable":false,"extension_type":"arrow"}}]}}
## remote parquet file
## paste url together so CRAN check doesn't complain
base_url = "https://raw.githubusercontent.com/geoarrow/"
data_url = "geoarrow-data/v0.2.0/natural-earth/files/natural-earth_countries_native.parquet"
url = paste0(base_url, data_url)

m |>
  addGeoArrowPolygonLayer(
    url = url
    , geom_column_name = "geometry"
    , render_options = renderOptions(
      extruded = FALSE
      , stroked = TRUE
    )
    , popup = TRUE
    , tooltip = TRUE
  )

{"x":{"style":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json","center":[0,0],"zoom":0,"bearing":0,"pitch":0,"projection":"globe","additional_params":[]},"evals":[],"jsHooks":{"render":[{"code":"function(el, x, data) {\n        map = this.getMap();\n        addGeoArrowDeckglPolygonLayer(map, data);\n      }","data":{"geom_column_name":"geometry","layerId":"polygon","popup":true,"tooltip":true,"renderOptions":{"radiusUnits":"pixels","radiusScale":1,"lineWidthUnits":"pixels","lineWidthScale":1,"stroked":true,"filled":true,"radiusMinPixels":3,"radiusMaxPixels":15,"lineWidthMinPixels":0,"lineWidthMaxPixels":15,"billboard":false,"antialiasing":false,"extruded":false,"wireframe":true,"elevationScale":1,"lineJointRounded":false,"lineMiterLimit":4,"widthUnits":"pixels","widthScale":1,"widthMinPixels":1,"widthMaxPixels":5,"capRounded":true,"jointRounded":false,"miterLimit":4,"beforeId":null,"zIndex":1},"dataAccessors":{"getRadius":null,"getColor":null,"getFillColor":null,"getLineColor":null,"getLineWidth":null,"getElevation":null,"getWidth":null},"popupOptions":{"anchor":"bottom","className":"deckglgeoarrow-popup","closeButton":true,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"tooltipOptions":{"anchor":"top-left","className":"deckglgeoarrow-tooltip","closeButton":false,"closeOnClick":false,"closeOnMove":false,"focusAfterOpen":true,"maxWidth":"none","offset":0,"subpixelPositioning":false},"parameters":{"depthCompare":"always","cullMode":"back"},"map_class":"maplibregl","interleaved":true,"pickable":true,"extension_type":"parquet"}}]}}
```
