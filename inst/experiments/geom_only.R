library(mapgl)
library(deckglgeoarrow)
library(geoarrow)
library(wk)
library(geos)
library(colourvalues)
library(arrow)
library(sf)


style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
style_darkmatter = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
style_openfreemap = 'https://tiles.openfreemap.org/styles/liberty'

options(viewer = NULL)

## point =======================================================================
pt = wkt("POINT (0 0)")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = pt
  )

m


## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = st_as_sfc(pt)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = as_geos_geometry(pt)
  )

m


## multipoint ==================================================================
mpt = wkt("MULTIPOINT (0 0, 1 1)")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = mpt
    , tooltip = TRUE
  )

m


## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = st_as_sfc(mpt)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = as_geos_geometry(mpt)
  )

m

## line ========================================================================
ln = wkt("LINESTRING (30 10, 10 30, 40 40)")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = ln
  )

m

## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = st_as_sfc(ln)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = as_geos_geometry(ln)
  )

m

## multiline ===================================================================
mln = wkt("MULTILINESTRING ((30 10, 10 30, 40 40), (20 0, 0 20, 30 30))")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = mln
  )

m

## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = st_as_sfc(mln)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPathLayer(
    data = as_geos_geometry(mln)
  )

m


## polygon =====================================================================
pl = wkt("POLYGON ((30 10, 10 30, 40 40, 30 10))")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = pl
    , render_options = renderOptions(
      beforeId = "water"
    )
  )

m

## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = st_as_sfc(pl)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = as_geos_geometry(pl)
  )

m

## multipolygon ================================================================
mpl = wkt("MULTIPOLYGON (((30 10, 10 30, 40 40, 30 10)), ((-30 10, -10 30, -40 40, -30 10)))")

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = mpl
  )

m

## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = st_as_sfc(mpl)
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowPolygonLayer(
    data = as_geos_geometry(mpl)
  )

m


## points ======================================================================
n = 1e6

pts = xy(
  x = runif(n, -180, 180)
  , y = runif(n, -50, 50)
  , crs = 4326
)

m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = pts
    , render_options = renderOptions(
      beforeId = "water"
    )
  )

m

## as sfc
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = st_as_sfc(pts)
    , render_options = renderOptions(
      beforeId = "water"
    )
  )

m

## as geos
m = maplibre(style = style_positron)

m = m |>
  addGeoArrowScatterplotLayer(
    data = as_geos_geometry(pts)
  )

m
