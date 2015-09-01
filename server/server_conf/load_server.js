// load and configure the http / https server - is the server
define( ["config", "http" ],
function( config, http )
{
  function loadServer( app )
  {
    var server = http.createServer( app || undefined );
    // launch the server listening
    server.listen( config.server_port, function()
    {
      console.log( "HTTP Server launched, Listening..", this.address() );
    } );
    return server;
  }
  return loadServer;
} );