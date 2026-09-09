#' Names and versions of external JavaScript libraries.
#'
#' Names and versions of the external JavaScript libraries used in
#' `deckglgeoarrow`.
#'
#' See e.g. \url{https://cdn.jsdelivr.net/npm/deck.gl/package.json}
#' or \url{https://cdn.jsdelivr.net/npm/@geoarrow/deck.gl-geoarrow/package.json}
#' for more details on the JavaScript depencencies.
#'
#' @returns
#'   A named character vector with the versions of the `Deck.gl`
#'   and `@geoarrow/deck.gl-layers` JavaScript libraries shipped with this package.
#'
#' @examples
#' extJSLibs()
#'
#' @tests tinytest
#' expect_length(extJSLibs(), 2)
#' expect_length(names(extJSLibs()), 2)
#'
#' @export
extJSLibs = function() {

  deckgl_fldr = system.file(
    "htmlwidgets/lib/deckgl"
    , package = "deckglgeoarrow"
  )

  deckglgeoarrow_fldr = system.file(
    "htmlwidgets/lib/deckgl-geoarrow"
    , package = "deckglgeoarrow"
  )


  structure(
    c(
      readLines(file.path(deckglgeoarrow_fldr, "version.txt"))
      , readLines(file.path(deckgl_fldr, "version.txt"))
    )
    , names = c(
      "@geoarrow/deck.gl-geoarrow"
      , "Deck.gl"
    )
  )

}
