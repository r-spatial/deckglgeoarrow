library(mapgl)
library(deckglgeoarrow)
library(geoarrow)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

options(viewer = NULL)

m = maplibre(style = style_positron)

# scatter parquet
m = m |>
  addGeoArrowScatterplotLayer(
    file = "~/Downloads/natural-earth_cities_native.parquet"
    # url = "https://raw.githubusercontent.com/geoarrow/geoarrow-data/v0.2.0/natural-earth/files/natural-earth_cities_native.parquet"
    , layer_id = "scatter2"
    , geom_column_name = "geometry" # attr(dat, "sf_column")
    , render_options = renderOptions(
      zIndex = 2
      # , beforeId = "place_town"
    )
    , data_accessors = dataAccessors(
      # getRadius = "radius"
      # , getFillColor = "fillColor"
      # , getLineWidth = "lineWidth"
      # , getLineColor = "lineColor"
      getRadius = 10
      , getFillColor = '#ff000090'
      , getLineColor = '#000000ff'
    )
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
      # , depthWriteEnabled = FALSE
      # , blendColorSrcFactor = 'one'
      # , blendAlphaSrcFactor = 'one'
      # , blendColorDstFactor = 'src-alpha'
      # , blendAlphaDstFactor = 'src-alpha'
      # , blendColorOperation = 'add'
      # , blendAlphaOperation = 'add'
    )
    , popup = TRUE
    , popup_options = popupOptions(
      anchor = "bottom-right"
    )
    , tooltip = TRUE
    , tooltip_options = tooltipOptions(
      anchor = "top-left"
    )
    # , interleaved = TRUE
    # , extension_type = "parquet"
  )

m |>
  add_globe_control()

## polygons parquet
options(viewer = NULL)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    url = "https://raw.githubusercontent.com/geoarrow/geoarrow-data/v0.2.0/natural-earth/files/natural-earth_countries_native.parquet"
    , geom_column_name = "geometry"
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , render_options = renderOptions(
      extruded = FALSE
      , stroked = TRUE
      # , beforeId = "boundary_county"
      , zIndex = 1
    )
    , popup = TRUE
    , tooltip = TRUE
  )

m |>
  add_globe_control()

## paths parquet
options(viewer = NULL)

m = maplibre(style = style_darkmatter)

m = m |>
  addGeoArrowPathLayer(
    url = "https://raw.githubusercontent.com/geoarrow/geoarrow-data/v0.2.0/example/files/example_linestring_native.parquet"
    , geom_column_name = "geometry"
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , data_accessors = dataAccessors(
      getColor = "#00ffff90"
      , getWidth = 5
    )
    , render_options = renderOptions(
      extruded = FALSE
      , stroked = TRUE
      # , beforeId = "boundary_county"
      , zIndex = 1
    )
    , popup = TRUE
    , tooltip = TRUE
  )

m |>
  add_globe_control()
