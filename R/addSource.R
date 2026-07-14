#' Add a data source to a [mapgl::maplibre()] or [mapgl::mapboxgl()] map.
#'
#' @param map the [mapgl::maplibre()] or [mapgl::mapboxgl()] map to add the
#' data source to.
#' @param id a unique `ID` for the data source.
#' @param data a `sf`, `wk`, `geos` or `SpatVector` object.
#' @param file a valid local file path to a `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `data` is supplied.
#' @param url a URL to a remotely hosted `geoarrow` or `geoparquet` file to be
#' added to the map. Ignored if `data` or `file` is supplied.
#' @param ... currently not used.
#'
#' @details
#' See [geoarrowWidget::attachData()] for details.
#'
#' @return The modified \code{map} object with the added data source attached.
#'
#' @examples
#' library(mapgl)
#' library(wk)
#'
#' pt = wkt("POINT (0 0)")
#'
#' m = maplibre(style = style_positron)
#'
#' m = m |>
#'   addSource(
#'     id = "pt"
#'     , data = pt
#'   )
#'
#' ## open the map in the browser, press <Ctrl+u> and look for a line like this:
#' ## <link id="pt-geoarrowWidget-attachment" rel="attachment" href="lib/pt-0.0.1/pt.arrow"/>
#' m
#'
#' @export
#'
addSource = function(
    map
    , id
    , data
    , file
    , url
    , ...
) {

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
    , name = id
  )

  return(map)
}
