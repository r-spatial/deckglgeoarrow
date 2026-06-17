# deckglgeoarrow: Use 'GeoArrow' to Add 'Deck.gl' Layers to a 'maplibregl'/'mapboxgl' Map

Leverages the very performant 'GeoArrow' memory layout to render
potentially very large 'Deck.gl' data layers on a
'maplibregl'/'mapboxgl' map created with R package 'mapgl'. The heavy
lifting is done on the 'JavaScript' side in the browser using
'deck.gl-geoarrow' (<https://github.com/geoarrow/deck.gl-geoarrow/>).
Currently provides functions for adding Scatterplot (points), Path
(lines) and Polygon (polygons) layers. Has support for data classes from
R packages 'wk' and 'sf'. In addition, convenience functions for styling
data, tooltips and popups, as well as layer management are provided.
Furthermore, remotely hosted 'GeoParquet' and 'GeoArrow' files can be
visualised directly in the browser, without the need to first read them
into R memory. Only the styling instructions are prepared by the user in
R and are then transferred to and applied in the browser as the data
arrives.

## See also

Useful links:

- <https://github.com/r-spatial/deckglgeoarrow>

- <https://r-spatial.github.io/deckglgeoarrow/>

- Report bugs at <https://github.com/r-spatial/deckglgeoarrow/issues>

## Author

**Maintainer**: Tim Appelhans <tim.appelhans@gmail.com>
([ORCID](https://orcid.org/0000-0002-9824-2707))

Other contributors:

- RConsortium ([ROR](https://ror.org/01z833950))
  (https://r-consortium.org/) \[funder\]
