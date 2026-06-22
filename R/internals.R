## helper to parse data to nanoarrow IPC stream - writing is done in gearrowWidget
## wk and sf(c) are supported, SpatVector needs to be converted beforehand!
parseGeoarrow = function(
    data
    , interleaved = TRUE
) {

  if (missing(data)) {
    return()
  }

  if (inherits(data, "nanoarrow_array_stream")) {
    return(data)
  }

  if (inherits(data, "SpatVector")) {
    stopifnot(
      "need package 'terra' to handle 'SpatVector'" =
        requireNamespace("terra", quietly = TRUE)
    )
    stopifnot(
      "need package 'geos' to handle 'SpatVector'" =
        requireNamespace("geos", quietly = TRUE)
    )

    geom = geos::geos_read_wkb(terra::geom(data, wkb = TRUE))
    data = as.data.frame(data)

    if (ncol(data) == 0) {
      data = geom
    } else {
      data$geometry = geoarrow::as_geoarrow_vctr(
        geom
        , schema = geoarrow::infer_geoarrow_schema(
          geom
          , coord_type = ifelse(interleaved, "INTERLEAVED", "SEPARATE")
        )
      )
    }
  }


  if (is.null(dim(data))) {
    data = data.frame(
      id = 1:length(data)
      , geometry = geoarrow::as_geoarrow_vctr(
        data
        , schema = geoarrow::infer_geoarrow_schema(
          data
          , coord_type = ifelse(interleaved, "INTERLEAVED", "SEPARATE")
        )
      )
      , check.rows = FALSE
      , check.names = FALSE
      , fix.empty.names = FALSE
    )
  }

  data_stream = nanoarrow::as_nanoarrow_array_stream(
    data
  )

  return(data_stream)

}



## helper to guess (remote url) file extension
guessFileExtension = function(data, file, url) {

  if (!missing(data)) {
    ## if data is present, we write .arrow
    return("arrow")
  }

  if (!missing(file)) {
    return(file_extension_map[[tools::file_ext(file)]])
  }

  if (!missing(url)) {
    return(file_extension_map[[tools::file_ext(url)]])
  }

  stop("need 'data', file' or 'url'!", call. = FALSE)

}

file_extension_map = list(
  "arrow" = "arrow"
  , "geoarrow" = "arrow"
  , "arrows" = "arrow"
  , "parquet" = "parquet"
  , "geoparquet" = "parquet"
)

## helper to write nanoarrow IPC stream to tempfile - deprecated
writeGeoarrow = function(
    data
    , path = tempfile()
    , id
    , geom_column_name
    , interleaved = TRUE
) {

  if (missing(data)) {
    return()
  }

  dir.create(path)
  path = file.path(
    path
    , sprintf(
    "%s.arrow"
    , id
    )
  )

  ## this is a hotfix scenario
  ## need to properly handle the conversion to data stream of the different classes !!!
  ## ideally this, along with wkb encoded geometries, would be handled upstream...
  if (inherits(data, c("wk_wkt", "wk_vctr", "sfc"))) {

    data = data.frame(
      id = 1:length(data)
      , geometry = data
    )

    scm = nanoarrow::infer_nanoarrow_schema(data)
    scm$children[[geom_column_name]] = geoarrow::infer_geoarrow_schema(
      data
      , coord_type = ifelse(interleaved, "INTERLEAVED", "SEPARATE")
    )

    data_stream = nanoarrow::as_nanoarrow_array_stream(
      data
      , schema = scm
    )

  }

  if (inherits(data, c("wk_xy", "wk_rcrd", "sf"))) {

    if (is.null(dim(data))) {
      data = data.frame(
        id = 1:length(data)
        , geometry = data
        , check.rows = FALSE
        , check.names = FALSE
        , fix.empty.names = FALSE
      )
    }

    data_stream = nanoarrow::as_nanoarrow_array_stream(
      data
      , geometry_schema = geoarrow::infer_geoarrow_schema(
        data
        , coord_type = ifelse(interleaved, "INTERLEAVED", "SEPARATE")
      )
    )

  }

  nanoarrow::write_nanoarrow(data_stream, path)

  return(path)

}
