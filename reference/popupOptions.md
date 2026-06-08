# Options for popups and tooltips

Options for popups and tooltips

## Usage

``` r
popupOptions(...)

tooltipOptions(...)
```

## Arguments

- ...:

  named options to be passed to the popups and tooltips of the map. See
  [maplibregl
  PopupOptions](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/)
  for details and available options.

## Details

Both `popupOptions` and `tooltipOptions` are passed to the PopupOptions
object of the [maplibregl
Popup](https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/)
constructor. See [maplibregl
PopupOptions](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/)
for details.

The `popupOptions` and `tooltipOptions` in this package only differ in
their respective defaults. These are:

For `popupOptions`

- anchor = "bottom"

- className = "geoarrow-deckgl-popup"

- closeButton = TRUE

- closeOnClick = TRUE

- closeOnMove = FALSE

- focusAfterOpen = TRUE

- maxWidth = "none"

- offset = 0

- subpixelPositioning = FALSE

For `tooltipOptions`

- anchor = "top-left"

- className = "geoarrow-deckgl-tooltip"

- closeButton = FALSE

- closeOnClick = FALSE

- closeOnMove = FALSE

- focusAfterOpen = TRUE

- maxWidth = "none"

- offset = 0

- subpixelPositioning = FALSE

## Functions

- `popupOptions()`: options for popups

- `tooltipOptions()`: options for tooltips

## Examples

``` r
# default
popupOptions()
#> $anchor
#> [1] "bottom"
#> 
#> $className
#> [1] "geoarrow-deckgl-popup"
#> 
#> $closeButton
#> [1] TRUE
#> 
#> $closeOnClick
#> [1] FALSE
#> 
#> $closeOnMove
#> [1] FALSE
#> 
#> $focusAfterOpen
#> [1] TRUE
#> 
#> $maxWidth
#> [1] "none"
#> 
#> $offset
#> [1] 0
#> 
#> $subpixelPositioning
#> [1] FALSE
#> 
tooltipOptions()
#> $anchor
#> [1] "top-left"
#> 
#> $className
#> [1] "geoarrow-deckgl-tooltip"
#> 
#> $closeButton
#> [1] FALSE
#> 
#> $closeOnClick
#> [1] FALSE
#> 
#> $closeOnMove
#> [1] FALSE
#> 
#> $focusAfterOpen
#> [1] TRUE
#> 
#> $maxWidth
#> [1] "none"
#> 
#> $offset
#> [1] 0
#> 
#> $subpixelPositioning
#> [1] FALSE
#> 

# modify selected options
tooltipOptions(anchor = "bottom-right", className = "my-css-class-name")
#> $anchor
#> [1] "bottom-right"
#> 
#> $className
#> [1] "my-css-class-name"
#> 
#> $closeButton
#> [1] FALSE
#> 
#> $closeOnClick
#> [1] FALSE
#> 
#> $closeOnMove
#> [1] FALSE
#> 
#> $focusAfterOpen
#> [1] TRUE
#> 
#> $maxWidth
#> [1] "none"
#> 
#> $offset
#> [1] 0
#> 
#> $subpixelPositioning
#> [1] FALSE
#> 
```
