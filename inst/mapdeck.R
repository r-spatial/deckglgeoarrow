# library(mapdeck)
# library(sf)
# library(colourvalues)
#
# n <- 1e6
# dat <- data.frame(
#   id = 1:n,
#   x = runif(n, -180, 180),
#   y = runif(n, -60, 60)
# )
# dat$fillColor = color_values(
#   rnorm(nrow(dat))
#   , alpha = sample.int(255, nrow(dat), replace = TRUE)
# )
# dat$lineColor = color_values(
#   rnorm(nrow(dat))
#   , alpha = sample.int(255, nrow(dat), replace = TRUE)
#   , palette = "inferno"
# )
# dat$radius = sample.int(15, nrow(dat), replace = TRUE)
# dat$lineWidth = sample.int(5, nrow(dat), replace = TRUE)
#
#
# mapdeck() |>
#   add_scatterplot(
#     data = dat
#     , lat = "y"
#     , lon = "x"
#     , radius = 100
#     , radius_min_pixels = 4
#     , radius_max_pixels = 15
#     , fill_colour = "fillColor"
#     , stroke_colour = "lineColor"
#     , stroke_width = "lineWidth"
#   )
#
#
# dat <- st_as_sf(
#   dat,
#   coords = c("x", "y"),
#   crs = 4326
# )
#
# path_layer = geoarrowDeckgl:::writeGeoarrow(
#   dat
#   , "test"
#   , "geometry"
# )
#
#
# options(viewer = NULL)
#
# ### TODO: figure out how to add to mapdeck/deckgl map. Seems fundamentally different
# ### from mapgl, but should be easy enough given it's the same framework
# ###
# ### More generally, should we provide methods for all possible rendering framweorks?
# ### mapgl (maplibregl/mapboxgl), mapdeck, deckgl, leaflet???
#
# m = mapdeck::mapdeck()
# # m = add_basemap(deckgl(), style = use_carto_style())
#
# m |>
#   geoarrowDeckgl:::addGeoArrowScatterplotLayer(
#     data = dat
#     , layerId = "test"
#     , geom_column_name = attr(dat, "sf_column")
#     , render_options = geoarrowDeckgl:::renderOptions()
#     , data_accessors = geoarrowDeckgl:::dataAccessors(
#       getRadius = "radius"
#       , getFillColor = "fillColor"
#       , getLineWidth = "lineWidth"
#       , getLineColor = "lineColor"
#     )
#     , popup = TRUE
#     , popup_options = geoarrowDeckgl:::popupOptions(anchor = "bottom-right")
#     , tooltip = FALSE
#     # , tooltip_options = geoarrowDeckgl:::tooltipOptions(anchor = "top-left")
#   )
#
#
# # map = mapdeck()
# # # map$dependencies[[2]] = NULL
# #
# # map$dependencies = c(
# #   map$dependencies
# #   , geoarrowDeckgl:::arrowDependencies()
# #   , geoarrowDeckgl:::geoarrowjsDependencies()
# #   , geoarrowDeckgl:::geoarrowDeckglLayersDependencies()
# #   , geoarrowDeckgl:::deckglDataAttachmentSrc(path_layer, "test")
# #   , geoarrowDeckgl:::helpersDependency()
# # )
# #
# # m = htmlwidgets::onRender(
# #   map
# #   , htmlwidgets::JS(
# #     "function(el, x, data) {
# #         debugger;
# #         //map_id = el.id;
# #         let gaDeckLayers = window['@geoarrow/deck']['gl-layers'];
# #
# #         let data_fl = document.getElementById(data.layerId + '-1-attachment');
# #
# #         fetch(data_fl.href)
# #           .then(result => Arrow.tableFromIPC(result))
# #           .then(arrow_table => {
# #           //debugger;
# #             let geoArrowScatterplot = new gaDeckLayers.GeoArrowScatterplotLayer({
# #               //map_id: el.id,
# #               id: data.layerId,
# #               data: arrow_table,
# #               getPosition: arrow_table.getChild(data.geom_column_name),
# #
# #               filled: true,
# #               stroked: true,
# #               radiusUnits: 'pixels',
# #
# #               getRadius: 7,
# #             })
# #             debugger;
# #             //let map = window[el.id+'map'];
# #             //map.setProps({ layers: [geoArrowScatterplot] });
# #             md_update_layer(el.id, data.layerId, geoArrowScatterplot);
# #           })
# #
# #           //debugger;
# #       }"
# #   )
# #   , data = list(
# #     layerId = "test"
# #     , geom_column_name = "geometry"
# #   )
# # )
# #
# # m
