#' Add a data source to a [mapgl::maplibre()] or [mapgl::mapboxgl()] map.
#'
#' @param map the [mapgl::maplibre()] or [mapgl::mapboxgl()] map to add the
#' data source to.
#' @param id a unique `ID` for the data source.
#' @param data a `sf`, `wk`, `geos`, `SpatVector` or `duckspatial_df` object.
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
#' m = maplibre()
#'
#' m = m |>
#'   addSource(
#'     id = "pt"
#'     , data = pt
#'   ) |>
#'   addGeoArrowScatterplotLayer(source = "pt")
#'
#' ## open the map in the browser, press <Ctrl+u> and look for a line like this:
#' ## <link id="pt-geoarrowWidget-attachment" rel="attachment" href="lib/pt-0.0.1/pt.arrow"/>
#' m
#'
#' @tests tinytest
#'
#' stream_method = function(x, ..., native = FALSE) native
#' registerS3method(
#'   "as_nanoarrow_array_stream"
#'   , "deckglgeoarrow_test_duckspatial_df"
#'   , stream_method
#'   , envir = asNamespace("nanoarrow")
#' )
#'
#' data = structure(
#'   list()
#'   , class = c("deckglgeoarrow_test_duckspatial_df", "duckspatial_df")
#' )
#'
#' expect_identical(deckglgeoarrow:::parseGeoarrow(data), TRUE)
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
