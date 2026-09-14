# File created by roxut; edit the function definition file, not this file

# Test found in addSource.R:37 (file:line)
  

stream_method = function(x, ..., native = FALSE) native
registerS3method(
  "as_nanoarrow_array_stream"
  , "deckglgeoarrow_test_duckspatial_df"
  , stream_method
  , envir = asNamespace("nanoarrow")
)

data = structure(
  list()
  , class = c("deckglgeoarrow_test_duckspatial_df", "duckspatial_df")
)

expect_identical(deckglgeoarrow:::parseGeoarrow(data), TRUE)
