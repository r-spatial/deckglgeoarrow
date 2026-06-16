# File created by roxut; edit the function definition file, not this file

# Test found in addGeoArrowScatterplotLayer.R:144 (file:line)
  

dummy_map <- structure(
  list(dependencies = list(), x = list()),
  class = "maplibregl"
)

## -----------------------------------------------------------------------
## 1. Default argument values
## -----------------------------------------------------------------------
# Confirm the formals carry the documented defaults so callers can rely on
# them without spelling them out.

f = formals(addGeoArrowScatterplotLayer)
expect_equal(f[["layer_id"]], "scatter")
expect_equal(f[["geom_column_name"]], "geometry")
expect_null(f[["popup"]])
expect_null(f[["tooltip"]])

## -----------------------------------------------------------------------
## 2. Function is a generic (S3 dispatch)
## -----------------------------------------------------------------------

# addGeoArrowScatterplotLayer must be an S3 generic so that maplibregl and
# mapboxgl map objects dispatch to the right method.

expect_true(isS3stdGeneric(addGeoArrowScatterplotLayer))

# Both concrete methods must be registered.

expect_true(
 "addGeoArrowScatterplotLayer.maplibregl" %in% ls(getNamespace("deckglgeoarrow"))
)
expect_true(
 "addGeoArrowScatterplotLayer.mapboxgl"   %in% ls(getNamespace("deckglgeoarrow"))
)

## -----------------------------------------------------------------------
## 3. All relevant instructions correctly forwarded
## -----------------------------------------------------------------------
# The internal helper converts FALSE to NULL so that downstream JavaScript
# receives a consistent value (null rather than false).
m = addGeoArrowScatterplotLayer(
  map = dummy_map
  , url = "https://example.com/data.parquet"
  , layer_id = "my-layer-id"
  , geom_column_name = "geom"
  , popup = FALSE
  , tooltip = FALSE
  , js_code = "function(){}"
  , customProp  = "hello"   # passed via ...
)

arg_list = m$jsHooks$render[[1]]$data

## -----------------------------------------------------------------------
## 3.1. popup, tooltip FALSE become NULL
## -----------------------------------------------------------------------
expect_null(
  arg_list[["popup"]]
  , info = "FALSE popup should become NULL"
)
expect_null(
  arg_list[["tooltip"]]
  , info = "FALSE tooltip should become NULL"
)

## -----------------------------------------------------------------------
## 3.2. layer_id and geom_column_name are forwarded to the data list
## -----------------------------------------------------------------------

expect_equal(arg_list[["layerId"]], "my-layer-id")
expect_equal(arg_list[["geom_column_name"]], "geom")

## -----------------------------------------------------------------------
## 3.3. map_class is forwarded correctly
## -----------------------------------------------------------------------

expect_equal(arg_list[["map_class"]], "maplibregl")

## -----------------------------------------------------------------------
## 3.4. Extra dots are merged into the data list (modifyList behaviour)
## -----------------------------------------------------------------------

expect_equal(
  arg_list[["customProp"]]
  , "hello"
  , info = "dot args must survive modifyList into the data list"
)
