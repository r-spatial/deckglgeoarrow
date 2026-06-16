# Getting started with deckglgeoarrow

The simplest use-case is

``` r

library(mapgl)
library(deckglgeoarrow)
library(wk)

style_positron = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

pt = wkt("POINT (0 0)")

maplibre(style = style_positron) |>
  addGeoArrowScatterplotLayer(
    data = pt
  )
```
