# Deck.gl data accessors

In deck.gl every layer type has a specific set of data accessors, see
e.g. those for
[ScatterPlotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer#data-accessors).
This function sets all defaults for all available layer functions in
this package.

## Usage

``` r
dataAccessors(...)
```

## Arguments

- ...:

  named accessors to be passed to the relevant deck.gl JavaScript
  Method.

## Value

List with named accessors, possibly modified via `...` argument.

## Details

Please refer to the relevant [deck.gl
documentation](https://deck.gl/docs/api-reference/layers/) for a more
detailed description of the available layer functions. See Details for a
list of currently available accessors, their defaults and the layer
types they apply to.

If you want to map a certain accessor to a data specific value, you will
need to add it to the data and provide the column name to the respective
data accessor.

Currently, the following accessors are automatically set to he following
defaults:

- getRadius = 1 (ScatterplotLayer)

- getColor = c(0, 0, 0, 255) (ScatterplotLayer, PathLayer)

- getFillColor = c(0, 0, 0, 130) (ScatterplotLayer, PolygonLayer)

- getLineColor = c(0, 0, 0, 255) (ScatterplotLayer, PolygonLayer)

- getLineWidth = 1 (ScatterplotLayer, PolygonLayer)

- getElevation = 1000 (PolygonLayer)

- getWidth = 1 (PathLayer)

NOTE:

- accessors `getPosition`, `getPath`, `getPolygon` are handled
  internally and should not be set!

- all `get*Color` accessors will accept either a vector of rgb(a)
  integers (0-255) or a hex color string (potentially also with alpha) -
  see examples.

## Examples

``` r
# default accessors
dataAccessors()
#> $getRadius
#> [1] 1
#> 
#> $getColor
#> [1]   0   0   0 255
#> 
#> $getFillColor
#> [1]   0   0   0 130
#> 
#> $getLineColor
#> [1]   0   0   0 255
#> 
#> $getLineWidth
#> [1] 1
#> 
#> $getElevation
#> [1] 1000
#> 
#> $getWidth
#> [1] 1
#> 

# modify selected accessors
dataAccessors(
  getFillColor = c(0, 0, 255, 130),
  getLineColor = "#ff00ffaa"
)
#> $getRadius
#> [1] 1
#> 
#> $getColor
#> [1]   0   0   0 255
#> 
#> $getFillColor
#> [1]   0   0 255 130
#> 
#> $getLineColor
#> [1] "#ff00ffaa"
#> 
#> $getLineWidth
#> [1] 1
#> 
#> $getElevation
#> [1] 1000
#> 
#> $getWidth
#> [1] 1
#> 
```
