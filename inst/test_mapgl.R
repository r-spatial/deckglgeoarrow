library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(sf)
library(colourvalues)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

### points =========================
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

options(viewer = NULL)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = dat
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


### polygons ==================================
# dat = st_read("~/Downloads/data.gpkg")
# url = "/vsizip//vsicurl/https://storage.googleapis.com/fao-maps-catalog-data/geonetwork/aquamaps/hydrobasins_asia.zip"
url = "~/Downloads/hydrobasins_asia.gpkg"
dat = st_read(url)
# dat = mapview::franconia
# idx = sapply(dat, is.factor)
# dat[idx] = NULL
dat$fillColor = color_values(dat$MAJ_BAS, palette = "spectral", alpha = 180)
dat$lineColor = dat$fillColor
# dat$elevation = sample.int(2000, nrow(dat), replace = TRUE)
# dat$lineWidth = sample.int(150, nrow(dat), replace = TRUE)


# options(viewer = NULL)

# m = maplibre(style = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json')

m = m |>
  addGeoArrowPolygonLayer(
    data = dat
    , layer_id = "polygon"
    , geom_column_name = attr(dat, "sf_column")
    , render_options = renderOptions(
      extruded = FALSE
      , stroked = FALSE
      # , beforeId = "boundary_county"
      , zIndex = 2
    )
    , data_accessors = dataAccessors(
      getFillColor = "fillColor"
      # , getLineColor = "lineColor"
      # , getLineWidth = 2 #"lineWidth"
      # , getElevation = "elevation"
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



### lines ======================================
# dat = st_read("~/Downloads/DLM_4000_GEWAESSER_20211015.gpkg", layer = "GEW_4100_FLIESSEND_L")
# dat = st_read("~/Downloads/rivers_africa.fgb")
# url = "/vsizip//vsicurl/https://storage.googleapis.com/fao-maps-catalog-data/geonetwork/aquamaps/rivers_asia_37331.zip"
url = "~/Downloads/rivers_asia.gpkg"
dat = st_read(url)
# dat = mapview::trails
# idx = sapply(dat, is.factor)
# dat[idx] = NULL
# dat = st_transform(dat, crs = "EPSG:4326")
dat$lineColor = color_values(
  dat$Strahler
  # , alpha = sample.int(255, nrow(dat), replace = TRUE)
  , palette = "blues"
)
dat$lineWidth = sample.int(150, nrow(dat), replace = TRUE)

options(viewer = NULL)

# m = maplibre(style = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json') |>
#   fit_bounds(unname(st_bbox(dat)), animate = FALSE)

m |>
  addGeoArrowPathLayer(
    data = dat
    # , layer_id = "deck-layer-group-before:aeroway-runway"
    , layer_id = "path"
    , geom_column_name = attr(dat, "sf_column")
    , render_options = renderOptions(
      widthUnits = "meters"
      , widthScale = 3000
      , zIndex = 3
      # , widthMaxPixels = 20
      # , beforeId = "housenumber"
    )
    , data_accessors = dataAccessors(
      getWidth = "Strahler"
      , getColor = "lineColor"
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
  ) |>
  set_view(c(100, 30), 2) |>
  add_globe_control() |>
  add_navigation_control(visualize_pitch = TRUE) |>
  add_layers_control(
    collapsible = TRUE
    # , layers = list("Deck Layer" = "deck-layer-group-before:aeroway-runway")
    , layers = list(
      "Scatter Layer" = generateDeckglLayerId("scatter", beforeId = "water")
      # "Scatter Layer" = "deck-layer-group-slot:scatter"
      # , "Path Layer" = "deck-layer-group-slot:path"
      , "Polygon Layer" = generateDeckglLayerId("polygon")
      , "Path Layer" = generateDeckglLayerId("path")
    )
  ) |>
  deckglgeoarrow:::addMouseCoordinates()

