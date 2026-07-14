library(wk)
library(s2)
library(mapgl)
library(deckglgeoarrow)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

n = 1e6

pts = data.frame(
  id = seq_len(n)
  , geometry = xy(
    x = runif(n, -180, 180)
    , y = runif(n, -70, 70)
    , crs = 4326
  )
)

pts$s2cell = as.character(as_s2_cell(pts$geometry))
pts$s2parent_l4 = as.character(s2_cell_parent(as_s2_cell(pts$s2cell), level = 4))


options(viewer = NULL)

m = maplibre(style = style_positron)

m |> addGeoArrowS2Layer(
  data = pts
  , s2_column_name = "s2cell"
)
