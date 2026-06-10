library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(wk)
library(colourvalues)
library(arrow)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

options(viewer = NULL)

### point =========================
pt = wkt("POINT (0 0)")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = pt
  )

m


## line
ln = wkt("LINESTRING (30 10, 10 30, 40 40)")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = ln
  )

m


## polygon
pl = wkt("POLYGON ((30 10, 10 30, 40 40, 30 10))")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = pl
  )

m

## points
n = 1e6

pts = xy(
  x = runif(n, -180, 180)
  , y = runif(n, -50, 50)
  , crs = 4326
)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = pts
    , render_options = renderOptions(
      beforeId = "water"
    )
  )

m







dat = data.frame(
  id = 1:n
  , geometry = geom
)

dat$fillColor = sample(hcl.colors(n, alpha = sample(seq(0, 1, length.out = n))))
dat$lineColor = sample(
  hcl.colors(n, alpha = sample(seq(0, 1, length.out = n)), palette = "inferno")
)
dat$radius = sample.int(15, nrow(dat), replace = TRUE)
dat$lineWidth = sample.int(5, nrow(dat), replace = TRUE)

options(viewer = NULL)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = dat
    , layer_id = "scatter1"
    , geom_column_name = "geometry" # attr(dat, "sf_column")
    , render_options = renderOptions(
      zIndex = 1
      # , beforeId = "water"
    )
    , data_accessors = dataAccessors(
      # getRadius = "radius"
      # , getFillColor = "fillColor"
      # , getLineWidth = "lineWidth"
      # , getLineColor = "lineColor"
      getRadius = 4
      , getFillColor = "#ff00ff80"
      , getLineColor = "#00ffffff"
      , getLineWidth = 1
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , popup = "id"
    , popup_options = popupOptions(
      anchor = "bottom-right"
    )
    , tooltip = "id"
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
    )
  )

m
