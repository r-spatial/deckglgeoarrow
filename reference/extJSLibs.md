# Names and versions of external JavaScript libraries.

Names and versions of the external JavaScript libraries used in
`deckglgeoarrow`.

## Usage

``` r
extJSLibs()
```

## Value

A named character vector with the versions of the `Deck.gl` and
`geoarrow-deckgl-layers` JavaScript libraries shipped with this package.

## Details

See e.g. <https://cdn.jsdelivr.net/npm/deck.gl/package.json> or
<https://cdn.jsdelivr.net/npm/@geoarrow/deck.gl-layers/package.json> for
more details on the JavaScript depencencies.

## Examples

``` r
extJSLibs()
#> deck.gl-geoarrow          deck.gl 
#>          "0.3.1"          "9.3.2" 
```
