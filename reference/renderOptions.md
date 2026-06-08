# Deck.gl render options

In deck.gl every layer type has a specific set of render options, see
e.g. those for
[ScatterPlotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer#render-options).
This function sets all defaults for all available layer functions in
this package. Please refer to the relevant [deck.gl
documentation](https://deck.gl/docs/api-reference/layers/) for a more
detailed description of the available layer functions. See Details for a
list of currently available options, their defaults and the layer types
they apply to.

## Usage

``` r
renderOptions(...)
```

## Arguments

- ...:

  named options to be passed to the relevant deck.gl JavaScript Method.

## Value

list with named options, possibly modified via `...` argument.

## Details

Currently, the following options are automatically set to he following
defaults:

- radiusUnits = "pixels" (ScatterplotLayer)

- radiusScale = 1 (ScatterplotLayer)

- lineWidthUnits = "pixels" (ScatterplotLayer, PolygonLayer)

- lineWidthScale = 1 (ScatterplotLayer, PolygonLayer)

- stroked = TRUE (ScatterplotLayer, PolygonLayer)

- filled = TRUE (ScatterplotLayer, PolygonLayer)

- radiusMinPixels = 3 (ScatterplotLayer)

- radiusMaxPixels = 15 (ScatterplotLayer)

- lineWidthMinPixels = 0 (ScatterplotLayer, PolygonLayer)

- lineWidthMaxPixels = 15 (ScatterplotLayer, PolygonLayer)

- billboard = FALSE (ScatterplotLayer, PathLayer)

- antialiasing = FALSE (ScatterplotLayer)

- extruded = FALSE (PolygonLayer)

- wireframe = TRUE (PolygonLayer)

- elevationScale = 1 (PolygonLayer)

- lineJointRounded = FALSE (PolygonLayer)

- lineMiterLimit = 4 (PolygonLayer)

- widthUnits = "pixels" (PathLayer)

- widthScale = 1 (PathLayer)

- widthMinPixels = 1 (PathLayer)

- widthMaxPixels = 5 (PathLayer)

- capRounded = TRUE (PathLayer)

- jointRounded = FALSE (PathLayer)

- miterLimit = 4 (PathLayer)

- beforeId = NULL (all Layer types)

## Examples

``` r
# default settings
renderOptions()
#> $radiusUnits
#> [1] "pixels"
#> 
#> $radiusScale
#> [1] 1
#> 
#> $lineWidthUnits
#> [1] "pixels"
#> 
#> $lineWidthScale
#> [1] 1
#> 
#> $stroked
#> [1] TRUE
#> 
#> $filled
#> [1] TRUE
#> 
#> $radiusMinPixels
#> [1] 3
#> 
#> $radiusMaxPixels
#> [1] 15
#> 
#> $lineWidthMinPixels
#> [1] 0
#> 
#> $lineWidthMaxPixels
#> [1] 15
#> 
#> $billboard
#> [1] FALSE
#> 
#> $antialiasing
#> [1] FALSE
#> 
#> $extruded
#> [1] FALSE
#> 
#> $wireframe
#> [1] TRUE
#> 
#> $elevationScale
#> [1] 1
#> 
#> $lineJointRounded
#> [1] FALSE
#> 
#> $lineMiterLimit
#> [1] 4
#> 
#> $widthUnits
#> [1] "pixels"
#> 
#> $widthScale
#> [1] 1
#> 
#> $widthMinPixels
#> [1] 1
#> 
#> $widthMaxPixels
#> [1] 5
#> 
#> $capRounded
#> [1] TRUE
#> 
#> $jointRounded
#> [1] FALSE
#> 
#> $miterLimit
#> [1] 4
#> 
#> $beforeId
#> NULL
#> 

# modify selected options
renderOptions(radiusUnits = "meters", radiusScale = 10)
#> $radiusUnits
#> [1] "meters"
#> 
#> $radiusScale
#> [1] 10
#> 
#> $lineWidthUnits
#> [1] "pixels"
#> 
#> $lineWidthScale
#> [1] 1
#> 
#> $stroked
#> [1] TRUE
#> 
#> $filled
#> [1] TRUE
#> 
#> $radiusMinPixels
#> [1] 3
#> 
#> $radiusMaxPixels
#> [1] 15
#> 
#> $lineWidthMinPixels
#> [1] 0
#> 
#> $lineWidthMaxPixels
#> [1] 15
#> 
#> $billboard
#> [1] FALSE
#> 
#> $antialiasing
#> [1] FALSE
#> 
#> $extruded
#> [1] FALSE
#> 
#> $wireframe
#> [1] TRUE
#> 
#> $elevationScale
#> [1] 1
#> 
#> $lineJointRounded
#> [1] FALSE
#> 
#> $lineMiterLimit
#> [1] 4
#> 
#> $widthUnits
#> [1] "pixels"
#> 
#> $widthScale
#> [1] 1
#> 
#> $widthMinPixels
#> [1] 1
#> 
#> $widthMaxPixels
#> [1] 5
#> 
#> $capRounded
#> [1] TRUE
#> 
#> $jointRounded
#> [1] FALSE
#> 
#> $miterLimit
#> [1] 4
#> 
#> $beforeId
#> NULL
#> 

```
