# Getting started with deckglgeoarrow

`deckglgeoarrow` provides functions to quickly add layers to a
`mapgl::maplibregl()` map.

``` r

library(mapgl)
library(deckglgeoarrow)
library(wk)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

n = 1e6

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
      zIndex = 1
      , beforeId = "water"
    )
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , popup = TRUE
  ) |>
  add_navigation_control(visualize_pitch = TRUE) |>
  set_view(c(0, 0), 2) |>
  add_globe_control() |>
  add_layers_control(
    layers = c("Scatter Layer" = generateDeckglLayerId(
      layer_id = "scatter", beforeId = "water")
    )
  )
```

``` r

maplibre(style = style_openfreemap) |>
  addGeoArrowScatterplotLayer(
    data = pts
    , layer_id = "scatter2"
    , geom_column_name = "geometry"
    , render_options = renderOptions(
      zIndex = 1
      # , beforeId = "water"
    )
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
    , popup = TRUE
  ) |>
  add_navigation_control(visualize_pitch = TRUE) |>
  set_view(c(0, 0), 2) |>
  add_globe_control() |>
  add_layers_control(
    layers = c("Scatter Layer 2" = generateDeckglLayerId(
      layer_id = "scatter2")
    )
  )
```
