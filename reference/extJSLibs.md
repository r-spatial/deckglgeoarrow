# Names and versions of external JavaScript libraries.

Names and versions of the external JavaScript libraries used in
`deckglgeoarrow`.

## Usage

``` r
extJSLibs()
```

## Value

A named character vector with the versions of the `Deck.gl` and
`@geoarrow/deck.gl-layers` JavaScript libraries shipped with this
package.

## Details

See e.g. <https://cdn.jsdelivr.net/npm/deck.gl/package.json> or
<https://cdn.jsdelivr.net/npm/@geoarrow/deck.gl-geoarrow/package.json>
for more details on the JavaScript depencencies.

## Examples

``` r
extJSLibs()
#> @geoarrow/deck.gl-geoarrow                    Deck.gl 
#>                    "0.4.2"                    "9.4.0" 
```
