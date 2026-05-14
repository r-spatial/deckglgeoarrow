library(mapgl)
library(geoarrowDeckglLayers)
library(geoarrow)
library(sf)
library(colourvalues)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points =========================
n = 5e6
dat = data.frame(
  id = 1:n
  , x = runif(n, -180, 180)
  , y = runif(n, -90, 90)
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

options(viewer = NULL)

m = maplibre(style = style_positron)

m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "scatter"
    , geom_column_name = attr(dat, "sf_column")
    , render_options = renderOptions(
      zIndex = 0
      , beforeId = "water"
    )
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
    , popup_options = popupOptions(
      anchor = "bottom-right"
    )
    , tooltip = FALSE
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
    )
    , interleaved = TRUE
  ) |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "scatter2"
    , geom_column_name = attr(dat, "sf_column")
    , render_options = renderOptions(
      zIndex = 1
      , stroked = FALSE
    )
    , data_accessors = dataAccessors(
      getFillColor = c(0, 0, 255, 10)
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
    )
    , interleaved = TRUE
  ) |>
  set_view(c(0, 0), 3) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE) |>
  add_layers_control(
    collapsible = TRUE
    , layers = list(
      "Scatter Layer 1" = "deck-layer-group-before:water"
      , "Scatter Layer 2" = "deck-layer-group-slot:scatter2"
    )
  ) |>
  geoarrowDeckglLayers:::addMouseCoordinates()
