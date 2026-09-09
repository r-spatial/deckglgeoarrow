## deck.gl-geoarrow as browser bundle ==========================================
rdeckglgeoarrowDependencies = function() {
  fldr = system.file(
    "htmlwidgets/lib/rdeckglgeoarrowjs"
    , package = "deckglgeoarrow"
  )

  list(
    htmltools::htmlDependency(
      name = "rdeckglgeoarrow"
      , version = readLines(
        file.path(
          system.file(
            "htmlwidgets/lib/deckgl-geoarrow"
            , package = "deckglgeoarrow"
          )
          , "version.txt"
        )
      )
      , src = c(fldr)
      , script = list(
        src = "rdeckglgeoarrow.min.js"
      )
    )
  )
}

## helpers js ==================================================================
helpersDependency = function() {
  list(
    htmltools::htmlDependency(
      "deckglgeoarrowHelpers"
      , '0.0.1'
      , src = system.file("htmlwidgets", package = "deckglgeoarrow")
      , script = "deckglgeoarrowHelpers.js"
      , stylesheet = 'css/deckglgeoarrow.css'
    )
  )
}
