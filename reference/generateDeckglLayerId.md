# Generate proper internal layer ids

Deck.gl injects layers into maplibre's canvas if `interleaved = TRUE`
(the default in all layer functions provided here). To do so, it
generates specific layer ids from the `layer_id` provided. This function
generates these deck.gl specific layer ids on the R side, so they can be
used in other controls, such as `mapgl::ad_layers_control()`.

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

## Examples

``` r
generateDeckglLayerId("my_scatterplot_layer")
#> [1] "deck-layer-group-slot:my_scatterplot_layer"
generateDeckglLayerId("my_scatterplot_layer", beforeId = "water")
#> [1] "deck-layer-group-before:water"
```
