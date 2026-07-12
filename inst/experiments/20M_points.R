library(mapgl)
library(deckglgeoarrow)
library(wk)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points =========================
n = 5e6

pts = data.frame(
  id = seq_len(n)
  , geometry = xy(
    x = runif(n, -180, 180)
    , y = runif(n, -90, 90)
    , crs = 4326
  )
)

options(viewer = NULL)

m = maplibre(style = style_positron)

m |>
  addGeoArrowScatterplotLayer(
    data = pts
    , layer_id = "scatter"
    , render_options = renderOptions(
      zIndex = 0
      , beforeId = "water"
      , stroked = TRUE
    )
    , data_accessors = dataAccessors(
      getFillColor = "#74aa2380" #c(0, 255, 255, 255)
      , getLineColor = "#4523bb"
      , getRadius = 7
      , getLineWidth = 4
    )
    , popup = TRUE
  )
