# Add a data source to a [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html) or [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html) map.

Add a data source to a
[`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
or
[`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
map.

## Usage

``` r
addSource(map, id, data, file, url, ...)
```

## Arguments

- map:

  the
  [`mapgl::maplibre()`](https://walker-data.com/mapgl/reference/maplibre.html)
  or
  [`mapgl::mapboxgl()`](https://walker-data.com/mapgl/reference/mapboxgl.html)
  map to add the data source to.

- id:

  a unique `ID` for the data source.

- data:

  a `sf`, `wk`, `geos` or `SpatVector` object.

- file:

  a valid local file path to a `geoarrow` or `geoparquet` file to be
  added to the map. Ignored if `data` is supplied.

- url:

  a URL to a remotely hosted `geoarrow` or `geoparquet` file to be added
  to the map. Ignored if `data` or `file` is supplied.

- ...:

  currently not used.

## Value

The modified `map` object with the added data source attached.

## Details

See
[`geoarrowWidget::attachData()`](https://r-spatial.github.io/geoarrowWidget/reference/attachData.html)
for details.

## Examples

``` r
library(mapgl)
library(wk)

pt = wkt("POINT (0 0)")

m = maplibre(style = style_positron)
#> Error: object 'style_positron' not found

m = m |>
  addSource(
    id = "pt"
    , data = pt
  )
#> Error: object 'm' not found

## open the map in the browser, press <Ctrl+u> and look for a line like this:
## <link id="pt-geoarrowWidget-attachment" rel="attachment" href="lib/pt-0.0.1/pt.arrow"/>
m
#> Error: object 'm' not found
```
