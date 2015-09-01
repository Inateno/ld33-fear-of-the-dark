define( [ "config", "socket.io", 'cookie-parser' ],
function( config, socketio, cookieParser )
{
  function load_sockets( server )
  {
    var sockets = socketio( server ); //say to the socket which app to listen
    
    sockets.use( function ( socket, next )
    {
      var req = {
        "headers": {
          "cookie": socket.request.headers.cookie,
        },
      };
      console.log( req.headers.cookie );
      // run the parser and store the sessionID
      cookieParser( config.SESSIONS.SESSION_SECRET )( req, null, function() {} );
      var name = config.SESSIONS.COOKIE_NAME;
      console.log( req.signedCookies[ name ], req.cookies[ name ] );
      socket.sessionID = req.signedCookies[ name ] || req.cookies[ name ];
      console.log( ( "      -> socket sessionID is: " + socket.sessionID ).help );
      console.log( "        IP enter - ", socket.request.connection.remoteAddress );
      console.log( "        socket id is", socket.id );
      next();
    } );
    return sockets;
  }
  return load_sockets;
} )