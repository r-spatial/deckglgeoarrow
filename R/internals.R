## helper to write nanoarrow IPC stream to tempfile
writeGeoarrow = function(
    data
    , path = tempfile()
    , layerId
    , geom_column_name
    , interleaved = TRUE
) {

  dir.create(path)
  path = file.path(
    path
    , sprintf(
    "%s.arrow"
    , layerId
    )
  )

  ## this is a hotfix scenario
  ## need to properly handle the conversion to data stream of the different classes !!!

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

## helper to guess remote url file extension
guessFileExtension = function(url) {
  file_extension_map[[tools::file_ext(url)]]
}

file_extension_map = list(
  "arrow" = "arrow"
  , "geoarrow" = "arrow"
  , "arrows" = "arrow"
  , "parquet" = "parquet"
  , "geoparquet" = "parquet"
)
