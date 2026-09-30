library(wk)
library(s2)
library(mapgl)
library(deckglgeoarrow)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

n = 5e5

pts = data.frame(
  id = seq_len(n)
  , geometry = xy(
    x = runif(n, -180, 180)
    , y = runif(n, -90, 90)
    , crs = 4326
  )
)

pts$s2cell = as_s2_cell(pts$geometry)
pts$s2parent_l3 = as.character(s2_cell_parent(pts$s2cell, level = 3))
pts$s2parent_l4 = as.character(s2_cell_parent(pts$s2cell, level = 4))
pts$s2parent_l5 = as.character(s2_cell_parent(pts$s2cell, level = 5))

pts$s2cell = as.character(pts$s2cell)

sbs = pts[!duplicated(pts$s2parent_l3), ]


options(viewer = NULL)

m = maplibre(style = style_positron)

m |>
  addSource(
    id = "s2cells"
    , data = sbs
  ) |>
  addGeoArrowS2Layer(
    source = "s2cells"
    , layer_id = "s2layerl3"
    , s2_column_name = "s2parent_l3"
    , data_accessors = dataAccessors(
      getFillColor = "#74aa2380"
      , getLineColor = "#4523bb"
      , getLineWidth = 2
    )
  ) |>
  addGeoArrowS2Layer(
    source = "s2cells"
    , layer_id = "s2layerl4"
    , s2_column_name = "s2parent_l4"
    , data_accessors = dataAccessors(
      getLineColor = "#990000"
      , getLineWidth = 4
    )
    , render_options = renderOptions(
      filled = FALSE
    )
  ) |>
  addGeoArrowS2Layer(
    source = "s2cells"
    , layer_id = "s2layerl5"
    , s2_column_name = "s2parent_l5"
    , data_accessors = dataAccessors(
      getLineColor = "#000000"
      , getLineWidth = 2
    )
    , render_options = renderOptions(
      filled = FALSE
    )
  ) |>
  set_view(c(0, 0), 2) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE)




dat = data.frame(
  token = as.character(
    s2_cell_parent(
      as_s2_cell(
        s2_lnglat(-75.7019612, 45.4186427)
      )
      , level = 1:30
    )
  )
  , elevation = seq(10, 1000, length.out = 30)
  , fillColor = hcl.colors(30, palette = "inferno", alpha = 0.1)
)

m = maplibre(style = style_positron)

m |>
  addGeoArrowS2Layer(
    data = dat
    , layer_id = "s2layer"
    , s2_column_name = "token"
    , render_options = renderOptions(
      extruded = TRUE
      , wireframe = TRUE
    )
    , data_accessors = dataAccessors(
      getFillColor = "fillColor"
      , getElevation = "elevation"
    )
  ) |>
  set_view(c(-45, 45), 1) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE)
