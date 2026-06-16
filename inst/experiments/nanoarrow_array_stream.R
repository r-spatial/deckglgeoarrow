library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(sf)
library(colourvalues)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points as nanoarrow_array_stream =========================
n = 5e3
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

data_stream = nanoarrow::as_nanoarrow_array_stream(
  dat
)

options(viewer = NULL)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = data_stream
    , layer_id = "scatter1"
    , geom_column_name = "geometry" # attr(dat, "sf_column")
    , render_options = renderOptions(
      zIndex = 1
      , beforeId = "water"
    )
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
      # getRadius = 10
      # , getFillColor = "#ff00ff80"
      # , getLineColor = "#00ffffff"
      # , getLineWidth = 5
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , popup = TRUE
    , popup_options = popupOptions(
      anchor = "bottom-right"
    )
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
    )
  )

m
