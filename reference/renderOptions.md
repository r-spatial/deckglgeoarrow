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

List with named options, possibly modified via `...` argument.

## Details

Currently, the following options are automatically set to the following
defaults:

**ScatterplotLayer**

- radiusUnits = "pixels"

- radiusScale = 1

- lineWidthUnits = "pixels"

- lineWidthScale = 1

- stroked = TRUE

- filled = TRUE

- radiusMinPixels = 3

- radiusMaxPixels = 15

- lineWidthMinPixels = 0

- lineWidthMaxPixels = 15

- billboard = FALSE

- antialiasing = FALSE

**PathLayer**

- widthUnits = "pixels"

- widthScale = 1

- widthMinPixels = 1

- widthMaxPixels = 5

- capRounded = TRUE

- jointRounded = FALSE

- miterLimit = 4

- billboard = FALSE

**PolygonLayer**

- lineMiterLimit = 4

- extruded = FALSE

- wireframe = TRUE

- elevationScale = 1

- lineJointRounded = FALSE

- lineWidthUnits = "pixels"

- lineWidthScale = 1

- stroked = TRUE

- filled = TRUE

- lineWidthMinPixels = 0

- lineWidthMaxPixels = 15

**All layers**

- beforeId = NULL

- zIndex = 1

`zIndex` can be used to set layers order if multiple layers are added to
a map. Higher values will be plotted on top of lower values. It is
ignored, if `beforeId` is supplied.

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
#> $zIndex
#> [1] 1
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
#> $zIndex
#> [1] 1
#> 

```
