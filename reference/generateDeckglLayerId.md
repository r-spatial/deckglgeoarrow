# Generate proper internal layer IDs

Deck.gl injects layers into maplibre's canvas if `interleaved = TRUE`
(the default in all layer functions provided here). To do so, it
generates specific layer IDs from the `layer_id` provided. This function
generates these deck.gl specific layer IDs on the R side, so they can be
used in other controls, such as
[`add_layers_control`](https://walker-data.com/mapgl/reference/add_layers_control.html).

## Usage

``` r
generateDeckglLayerId(layer_id, beforeId = NULL)
```

## Arguments

- layer_id:

  the layer id provided to the respective `addGeoArrowDeckgl*` layer
  function used.

- beforeId:

  the `beforeId` used in the respective `addGeoArrowDeckgl*` layer
  function used.

## Value

Character vector of internally used layer IDs.

## Examples

``` r
generateDeckglLayerId("my_scatterplot_layer")
#> [1] "deck-layer-group-slot:my_scatterplot_layer"
generateDeckglLayerId(beforeId = "water")
#> [1] "deck-layer-group-before:water"
```
