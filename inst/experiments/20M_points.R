library(mapgl)
library(deckglgeoarrow)
library(sf)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points =========================
n = 25e6
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
      , stroked = TRUE
    )
    , popup = TRUE
  )
