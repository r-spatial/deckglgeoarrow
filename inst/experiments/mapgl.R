library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(sf)
library(colourvalues)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points =========================
n = 1e6
pts = data.frame(
  id = 1:n
  , x = runif(n, -180, 180)
  , y = runif(n, -90, 90)
)
pts = st_as_sf(
  pts
  , coords = c("x", "y")
  , crs = 4326
)
pts$fillColor = sample(hcl.colors(n, alpha = sample(seq(0, 1, length.out = n))))
pts$lineColor = sample(
  hcl.colors(n, alpha = sample(seq(0, 1, length.out = n)), palette = "inferno")
)
pts$radius = sample.int(15, nrow(pts), replace = TRUE)
pts$lineWidth = sample.int(5, nrow(pts), replace = TRUE)

### polygons ==================================
# url = "/vsizip//vsicurl/https://storage.googleapis.com/fao-maps-catalog-data/geonetwork/aquamaps/hydrobasins_asia.zip"
url = "~/Downloads/hydrobasins_asia.gpkg"
pls = st_read(url)

pls$fillColor = color_values(pls$MAJ_BAS, palette = "spectral", alpha = 180)
pls$lineColor = pls$fillColor

### lines ======================================
# url = "/vsizip//vsicurl/https://storage.googleapis.com/fao-maps-catalog-data/geonetwork/aquamaps/rivers_asia_37331.zip"
url = "~/Downloads/rivers_asia.gpkg"
lns = st_read(url)

lns$lineColor = color_values(
  lns$Strahler
  # , alpha = sample.int(255, nrow(lns), replace = TRUE)
  , palette = "blues"
)
lns$lineWidth = sample.int(150, nrow(lns), replace = TRUE)



options(viewer = NULL)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = pts
    , layer_id = "scatter1"
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

m = m |>
  addGeoArrowPolygonLayer(
    data = pls
    , layer_id = "polygon"
    , geom_column_name = attr(pls, "sf_column")
    , render_options = renderOptions(
      extruded = FALSE
      , stroked = FALSE
      , zIndex = 2
    )
    , data_accessors = dataAccessors(
      getFillColor = "fillColor"
    )
    , popup = TRUE
    , tooltip = TRUE
    , interleaved = TRUE
    , parameters = list(
      ## FIXME: neither depthTest:false nor depthCompare:"always" work in globe
      depthTest = FALSE
      , depthCompare = "always"
      # , antialias = TRUE
      , cullMode = "back"
    )
  )

m |>
  addGeoArrowPathLayer(
    data = lns
    , layer_id = "path"
    , geom_column_name = attr(lns, "sf_column")
    , render_options = renderOptions(
      widthUnits = "meters"
      , widthScale = 3000
      , zIndex = 3
    )
    , data_accessors = dataAccessors(
      getWidth = "Strahler"
      , getColor = "lineColor"
    )
    , popup = TRUE
    , tooltip = TRUE
    , interleaved = TRUE
    , parameters = list(
      depthTest = FALSE
      , depthCompare = "always"
      , cullMode = "back"
    )
  ) |>
  set_view(c(100, 30), 2) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE) |>
  add_layers_control(
    collapsible = TRUE
    , layers = list(
      "Scatter Layer" = generateDeckglLayerId("scatter", beforeId = "water")
      , "Polygon Layer" = generateDeckglLayerId("polygon")
      , "Path Layer" = generateDeckglLayerId("path")
    )
  ) |>
  deckglgeoarrow:::addMouseCoordinates()
