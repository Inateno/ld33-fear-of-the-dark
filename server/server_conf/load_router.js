// server configuration
// define server's routes
define( [ "config", "routes" ],
function( config, routes )
{
  function load_router( app )
  {
    if ( !app )
      return;
    
    // check out i18n-node for multi-language application
    app.get( '/', function( req, res )
    {
      res.send( "nop" );
      // res.render( "index", {} );
    } );
    app.get( '/keepAlive', routes.keepAlive );
    app.get( '/hackInit', routes.hackInit );
    app.get( '/nPlayers', routes.nPlayers );
  }
  return load_router;
} );