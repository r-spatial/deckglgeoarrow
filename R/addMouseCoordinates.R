addMouseCoordinates <- function(map, css = list()) {

  map$dependencies = c(
    map$dependencies
    , list(
      htmltools::htmlDependency(
        name = "mousecoords"
        , version = "0.0.1"
        , src = system.file("htmlwidgets", package = "deckglgeoarrow")
        , script = "mousecoords.js"
      )
    )
  )

  css_dflt = list(
    'position' = 'relative'
    , 'background-color' = 'rgba(255, 255, 255, 0.7)'
    , 'box-shadow' = '0 0 2px #bbb'
    , 'background-clip' = 'padding-box'
    , 'margin' = 'auto'
    , 'padding-left' = '5px'
    , 'padding-right' = '5px'
    , 'color' = '#333'
    , 'font-size' = '12px'
    , 'display' = 'flex'
    , 'justify-content' = 'center'
    , 'align-items' = 'center'
    , 'width' = 'fit-content'
    , 'z-index' = '700'
  )

  css = utils::modifyList(css_dflt, css)

  js_code = htmlwidgets::JS(
    "function(el, x, data) {
      map = this.getMap();
      addMouseCoordinates(el, map, data);
    }"
  )

  map = htmlwidgets::onRender(
    map
    , htmlwidgets::JS(js_code)
    , data = css
  )

  return(map)

}
