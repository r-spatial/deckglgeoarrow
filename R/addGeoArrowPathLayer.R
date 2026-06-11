#' Add Deck.gl PathLayer to a [mapgl::maplibre()] or [mapgl::mapboxgl()] map
#' using blazing fast [nanoarrow::write_nanoarrow()] data transfer.
#'
#' @param map the [mapgl::maplibre()] or [mapgl::mapboxgl()] map to add the layer to.
#' @param data a sf `(MULTI)LINESTRING` object.
#' @param file a valid local file path to a `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `data` is supplied.
#' @param url a URL to a remotely hosted `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `data` or `file` is supplied.
#' @param layer_id the layer id.
#' @param geom_column_name the name of the geometry column of the sf object.
#' It is inferred automatically if only one is present.
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
#' @examples
#' library(wk)
#' library(mapgl)
#'
#' style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
#'
#' m = maplibre(style = style_positron)
#'
#' ## single wk LINESTRING
#' ln = wkt("LINESTRING (30 10, 10 30, 40 40)")
#'
#' m |>
#'   addGeoArrowPathLayer(
#'     data = ln
#'     , data_accessors = dataAccessors(
#'       getColor = "#ff000080"
#'       , getWidth = 3
#'     )
#'   )
#'
#' ## remote parquet file
#' m |>
#'   addGeoArrowPathLayer(
#'     url = "https://raw.githubusercontent.com/geoarrow/geoarrow-data/v0.2.0/example/files/example_linestring_native.parquet"
#'     , geom_column_name = "geometry"
#'     , data_accessors = dataAccessors(
#'       getColor = "#0000ff90"
#'       , getWidth = 5
#'     )
#'     , popup = TRUE
#'     , tooltip = TRUE
#'   )
#'
#' @export
addGeoArrowPathLayer = function(
    map
    , data
    , file
    , url
    , layer_id = "path"
    , geom_column_name = "geometry"
    , popup = NULL
    , tooltip = NULL
    , render_options = renderOptions()
    , data_accessors = dataAccessors()
    , popup_options = popupOptions()
    , tooltip_options = tooltipOptions()
    , ...
) {

  stopifnot(requireNamespace("geoarrow"))
  UseMethod("addGeoArrowPathLayer")

}

.addGeoArrowPathLayer = function(
    map
    , data
    , file
    , url
    , layer_id = "path"
    , geom_column_name = "geometry"
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

  map$dependencies = c(
    map$dependencies
    , list(
      htmltools::htmlDependency(
        name = "deckglPathLayer"
        , version = "0.0.1"
        , src = system.file("htmlwidgets", package = "deckglgeoarrow")
        , script = "addGeoArrowDeckglPathLayer.js"
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

  if (!missing(data)) {

    data = parseGeoarrow(
      data = data
      , interleaved = TRUE
    )

  }

  map = geoarrowWidget::attachData(
    widget = map
    , data = data
    , file = file
    , url = url
    , name = layer_id
  )

  extension_type = guessFileExtension(
    data = data
    , file = file
    , url = url
  )

  map$dependencies = c(
    map$dependencies
    , deckglgeoarrowDependencies()
    , helpersDependency()
  )

  if (missing(js_code)) {
    js_code = htmlwidgets::JS(
      "function(el, x, data) {
        map = this.getMap();
        addGeoArrowDeckglPathLayer(map, data);
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
    geom_column_name = geom_column_name
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
    , extension_type = extension_type
  )

  dot_lst = list(...)

  map = htmlwidgets::onRender(
    map
    , htmlwidgets::JS(js_code)
    , data = utils::modifyList(default_lst, dot_lst)
  )

  return(map)

}

#' @export
addGeoArrowPathLayer.maplibregl = function(
    map
    , ...
) {
  .addGeoArrowPathLayer(
    map
    , ...
    , map_class = "maplibregl"
  )
}

#' @export
addGeoArrowPathLayer.mapboxgl = function(
    map
    , ...
) {
  .addGeoArrowPathLayer(
    map
    , ...
    , map_class = "mapboxgl"
  )
}
