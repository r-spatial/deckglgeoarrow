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
      "rdeckglgeoarrowHelpers"
      , '0.0.1'
      , src = system.file("htmlwidgets", package = "deckglgeoarrow")
      , script = c(
        "rdeckglgeoarrowHelpers.js"
        , "progressiveArrowBatches.js"
      )
      , stylesheet = 'css/deckglgeoarrow.css'
    )
  )
}

attachWasmDependencies = function(widget, file_extension) {

  # no wasm dependency needed if (geo)arrow
  if (file_extension == "arrow") {
    widget = geoarrowWidget::attachGeoarrowDependencies(
      widget = widget
    )
  }

  if (file_extension == "parquet") {
    widget = geoarrowWidget::attachGeoParquetWasmDependencies(
      widget = widget
    )
  }

  if (file_extension == "fgb") {
    widget = geoarrowWidget::attachFlatgeobufWasmDependencies(
      widget = widget
    )
  }

  return(widget)

}
