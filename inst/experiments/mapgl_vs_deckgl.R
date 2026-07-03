library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(sf)
library(colourvalues)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

### points =========================
n = 1e6
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

m1 = maplibre(style = style_positron)
m2 = m1

m1 = m1 |>
  add_circle_layer(
    id = "circle"
    , source = dat
    , circle_radius = get_column("radius")
    , circle_color = get_column("fillColor")
    , circle_stroke_width = get_column("lineWidth")
    , circle_stroke_color = get_column("lineColor")
  )

m2 = m2 |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "scatter"
    , geom_column_name = attr(dat, "sf_column")
    , data_accessors = dataAccessors(
      getRadius = "radius"
      , getFillColor = "fillColor"
      , getLineWidth = "lineWidth"
      , getLineColor = "lineColor"
    )
  )

m1

m2

# compare(m1, m2, mode = "sync")
