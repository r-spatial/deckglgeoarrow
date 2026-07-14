#' Add Deck.gl S2Layer to a [mapgl::maplibre()] or [mapgl::mapboxgl()] map
#' using blazing fast [nanoarrow::write_nanoarrow()] data transfer.
#'
#' @param map the [mapgl::maplibre()] or [mapgl::mapboxgl()] map to add the layer to.
#' @param data a `sf`, `wk`, `geos` or `SpatVector` `(MULTI)POLYGON` object.
#' Ignored if `source` is supplied.
#' @param source the `id` of a source previously added via [addSource()].
#' @param file a valid local file path to a `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `source` or `data` is supplied.
#' @param url a URL to a remotely hosted `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `source` or `data` or `file` is supplied.
#' @param layer_id the layer id.
#' @param s2_column_name the name of the S2 cells column of the data object.
#' @param popup should a popup be contructed? If `TRUE`, will create a popup fromm all
#' available attributes of the feature. Can also be a character vector of column
#' names, on which case the popup will include only those columns. If a single character
#' is supplied, then this will be shown for all features. If `NULL` (deafult) or
#' `FALSE`, no popup will be shown.
#' @param tooltip should a tooltip be contructed? If `TRUE`, will create a tooltip fromm all
#' available attributes of the feature. Can also be a character vector of column
#' names, on which case the tooltip will include only those columns. If a single character
#' is supplied, then this will be shown for all features. If `NULL` (deafult) or
#' `FALSE`, no tooltip will be shown.
#' @param render_options a list of [renderOptions]
#' @param data_accessors a list of [dataAccessors]
#' @param popup_options a list of [popupOptions]
#' @param tooltip_options a list of [tooltipOptions]
#' @param ... can be used to pass additional props and parameters to the deck.gl
#' instance. See Details for more info.
#'
#' @details
#' `...` can be used to pass additional props and parameters to the deck.gl instance
#' for fine-tuning rendering behaviour. For example, we can pass a list called
#' `parameters` with settings that control the GPU pipeline of the deck.gl instance.
#' See \url{https://luma.gl/docs/api-reference/core/parameters} for a list of
#' available prarmeters.
#'
#' By default, all deck.gl layers passed to a `maplibre()` map will be drawn on
#' top of existing ones. It is, however, possible to inject layers into the
#' existing `maplibre` (base) layer stack by using
#' `render_options = renderOptions(beforeId = "<some-existing-layer-id>")`
#' which will plot the current layer underneath `"<some-existing-layer-id>"`.
#' See below for an example.
#'
#' @return The modified \code{map} object with the added polygon layer.
#'
#' @examples
#' library(wk)
#' library(mapgl)
#'
#' style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
#'
#' m = maplibre(style = style_positron)
#'
#' ## single wk POLYGON
#' pl = wkt("POLYGON ((30 10, 10 30, 40 40, 30 10))")
#'
#' m |>
#'   addGeoArrowPolygonLayer(
#'     data = pl
#'     , render_options = renderOptions(
#'       beforeId = "water"
#'     )
#'   )
#'
#' ## remote parquet file
#' ## paste url together so CRAN check doesn't complain
#' base_url = "https://raw.githubusercontent.com/geoarrow/"
#' data_url = "geoarrow-data/v0.2.0/natural-earth/files/natural-earth_countries_native.parquet"
#' url = paste0(base_url, data_url)
#'
#' m |>
#'   addGeoArrowPolygonLayer(
#'     url = url
#'     , geom_column_name = "geometry"
#'     , render_options = renderOptions(
#'       extruded = FALSE
#'       , stroked = TRUE
#'     )
#'     , popup = TRUE
#'     , tooltip = TRUE
#'   )
#'
addGeoArrowS2Layer = function(
    map
    , data
    , source
    , file
    , url
    , layer_id = "s2"
    , s2_column_name = "s2_cells"
    , popup = NULL
    , tooltip = NULL
    , render_options = renderOptions()
    , data_accessors = dataAccessors()
    , popup_options = popupOptions()
    , tooltip_options = tooltipOptions()
    , ...
) {

  UseMethod("addGeoArrowS2Layer")

}

.addGeoArrowS2Layer = function(
    map
    , data
    , source
    , file
    , url
    , layer_id = "s2"
    , s2_column_name = "s2_cells"
    , popup = NULL
    , tooltip = NULL
    , render_options = renderOptions()
    , data_accessors = dataAccessors()
    , popup_options = popupOptions()
    , tooltip_options = tooltipOptions()
    , map_class = "maplibregl"
    , js_code
    , ...
) {

  stopifnot(requireNamespace("geoarrow", quietly = TRUE))

  map$dependencies = c(
    map$dependencies
    , list(
      htmltools::htmlDependency(
        name = "deckglS2Layer"
        , version = "0.0.1"
        , src = system.file("htmlwidgets", package = "deckglgeoarrow")
        , script = "addGeoArrowDeckglS2Layer.js"
      )
    )
  )

  map$dependencies = c(
    map$dependencies
    , if (!inherits(map, "mapdeck")) deckglDependencies()
  )

  map = geoarrowWidget::attachParquetWasmDependencies(
    widget = map
  )

  if (missing(source)) {
    map = addSource(
      map = map
      , data = data
      , file = file
      , url = url
      , id = layer_id
    )
  } else {
    layer_id = source
  }

  map$dependencies = c(
    map$dependencies
    , deckglgeoarrowDependencies()
    , helpersDependency()
  )

  if (missing(js_code)) {
    js_code = htmlwidgets::JS(
      "function(el, x, data) {
        map = this.getMap();
        addGeoArrowDeckglS2Layer(map, data);
      }"
    )
  }

  if (isFALSE(popup)) {
    popup = NULL
  }

  if (isFALSE(tooltip)) {
    tooltip = NULL
  }

  default_lst = list(
    s2_column_name = s2_column_name
    , layerId = layer_id
    , popup = popup
    , tooltip = tooltip
    , renderOptions = render_options
    , dataAccessors = data_accessors
    , popupOptions = popup_options
    , tooltipOptions = tooltip_options
    , parameters = list(
      depthCompare = "always"
      , cullMode = "back"
    )
    , map_class = map_class
    , interleaved = TRUE
    , pickable = any(pickable(popup), pickable(tooltip))
  )

  dot_lst = list(...)

  map = htmlwidgets::onRender(
    map
    , htmlwidgets::JS(js_code)
    , data = utils::modifyList(default_lst, dot_lst, keep.null = TRUE)
  )

  return(map)

}

#' @export
addGeoArrowS2Layer.maplibregl = function(
    map
    , ...
) {
  .addGeoArrowS2Layer(
    map
    , ...
    , map_class = "maplibregl"
  )
}

#' @export
addGeoArrowS2Layer.mapboxgl = function(
    map
    , ...
) {
  .addGeoArrowS2Layer(
    map
    , ...
    , map_class = "mapboxgl"
  )
}
