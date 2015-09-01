define( [ 'config', 'shared', 'cookie-parser', 'path' ],
function( config, shared, cookieParser, path )
{
  var routes = {};
  routes.post = {};
  
  // is current user logged in ?
  routes.auth = function ( req, res, next )
  {
    // make a file with sessions inside then
    next();
    // if ( shared.sessions[ req.session.sessionID ] && shared.sessions[ req.session.sessionID ].account )
    //   next();
    // else
    //   res.redirect( 'http://dreamirl.com/#Other/Login/required' );
  };
  
  // client call this for the first time to let the cookie updated and when we read it in first keepAlive it's the good one
  routes.hackInit = function( req, res )
  {
    req.session.inited = true;
    res.send( "var initHacked = true" );
  };
  routes.keepAlive = function ( req, res )
  {
    if ( !req.session.inited )
      return;
    if ( !req.session.stimes )
    {
      console.log( req.headers.cookie );
      cookieParser( config.SESSIONS.SESSION_SECRET )( req, null, function() {} );
      var name = config.SESSIONS.COOKIE_NAME;
      req.session.sessionID = req.signedCookies[ name ] || req.cookies[ name ];
      req.session.stimes = 0;
    }
    console.log( ( " keepAlive -> req sessionID is: " + req.session.sessionID ).help );
    if ( shared.sessions[ req.session.sessionID ] )
      console.log( 'isLogged ? ' + ( shared.sessions[ req.session.sessionID ].account ? true : false ) );
    res.send( "var keepAlive = " + ( req.session.stimes++ ) );
  };
  
  routes.nPlayers = function( req, res )
  {
    res.send( "var nPlayersConnected = " + shared.nPlayers );
  };
  
  return routes;
} )