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

  data_stream = nanoarrow::as_nanoarrow_array_stream(
    data
    , geometry_schema = geoarrow::infer_geoarrow_schema(
      data
      , coord_type = ifelse(interleaved, "INTERLEAVED", "SEPARATE")
    )
  )

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
