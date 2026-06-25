# Getting started with deckglgeoarrow

`deckglgeoarrow` provides functions to quickly add layers to a
`mapgl::maplibregl()` map.

### Layers

Currently, the following `add*Layer` functions are available:

- `addGeoarrowScatterplotLayer` - points
- `addGeoarrowPathLayer` - lines
- `addGeoarrowPolygonLayer` - polygons

All layers accept one of three data related inputs:

- `data` - an R object from packages `wk`, `sf`, `geos` or `terra`
- `file` - a local file path to a `geoarrow` or `geoparquet` file
- `url` - a remote URL pointing to a `geoarrow` or `geoparquet` file

In addition, mainly for developers, `nanoarrow_array_streams` are also
supported.

### Styles

For style customisation, all (Deck.gl) layers have two types of
properties:

- `render_options` — constant properties across a layer (use function
  [`renderOptions()`](https://r-spatial.github.io/deckglgeoarrow/reference/renderOptions.md))
- `data_accessors` — properties that can vary across rows (use function
  [`dataAccessors()`](https://r-spatial.github.io/deckglgeoarrow/reference/dataAccessors.md))

Additionally, `popup`(s) and `tooltip`(s) can be defined in various
ways:

- `TRUE` - all attributes of a feature will be displayed
- `NULL`/`FALSE` - no popup/tooltip will be shown
- a character vector of `column names` - only the specified attribute
  columns will be shown

Similar to the style cusomisation mentioned above, `popups` and
`tooltips` can be customised using `popup_options` via function
[`popupOptions()`](https://r-spatial.github.io/deckglgeoarrow/reference/popupOptions.md)
and `tooltip_options` via function
[`tooltipOptions()`](https://r-spatial.github.io/deckglgeoarrow/reference/popupOptions.md)

### Example

Putting this together, here’s example showing 1k points using
`addGeoarrowScatterplotLayer`

``` r

library(mapgl)
library(deckglgeoarrow)
library(wk)

style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

n = 1e3

pts = data.frame(
  id = 1:n
  , geometry = xy(
    x = runif(n, -180, 180)
    , y = runif(n, -90, 90)
    , crs = 4326
  )
)

pts$radius = sample.int(15, nrow(pts), replace = TRUE)
pts$fillColor = sample(hcl.colors(n, alpha = sample(seq(0, 1, length.out = n))))
pts$lineWidth = sample.int(5, nrow(pts), replace = TRUE)
pts$lineColor = sample(
  hcl.colors(n, alpha = sample(seq(0, 1, length.out = n)), palette = "inferno")
)

maplibre(style = style_openfreemap) |>
  addGeoArrowScatterplotLayer(
    data = pts
    , layer_id = "scatter"
    , geom_column_name = "geometry"
    , render_options = renderOptions(
      beforeId = "water"
    )
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , popup = TRUE
    , popup_options = popupOptions(
      anchor = "bottom-right"
    )
    , tooltip = "id"
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
      , closeOnMove = TRUE
    )
  ) |>
  add_navigation_control(visualize_pitch = TRUE) |>
  set_view(c(0, 0), 2) |>
  add_globe_control() |>
  add_layers_control(
    layers = list("Scatter Layer" = generateDeckglLayerId(
      layer_id = "scatter", beforeId = "water")
    )
  )
```

More examples can be found
[here](https://github.com/r-spatial/deckglgeoarrow/tree/main/inst/experiments).
