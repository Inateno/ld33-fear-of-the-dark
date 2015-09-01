// load and configure express - is the app
define( [ 'config', 'shared', 'express', 'path', 'express-session'
       , 'cookie-parser', 'morgan', 'errorhandler'
      /*/, 'toobusy'/**/ ],
function ( config, shared, express, path, session
          , cookieParser, logger, errorHandler
      /*/, toobusy/**/ )
{
  var toobusy = toobusy || function(){};
  function load_app( dirname )
  {
    var app = express();
    
    app.dirname = dirname;
    
    // set public folder
    // app.use( express.static( path.join( dirname, '/public' ) ) );
    // app.use( express.static( path.join( dirname, '/public/imgs/users' ) ) );
    
    // allow parsing cookies - before creating session
    app.use( cookieParser( config.SESSIONS.SESSION_SECRET ) ); // not sure if secret pass is required
    
    // session management - not working ?
    app.use( session( {
      "secret": config.SESSIONS.SESSION_SECRET // private crypting key
      ,"resave": true // don't save session if unmodified - needed ?
      ,"saveUninitialized": true // don't create session until something stored - needed ?
      ,"cookie": { maxAge: config.SESSIONS.MAX_AGE }
      ,"name": config.SESSIONS.COOKIE_NAME
      // internal session storage engine, default engine with express
      // look for more (advanced) with: npm search connect session store
      // ,"store": // redis or something to store sessions
    } ) );
    
    // rendering
    // app.engine( '.html', ejs.__express );
    // app.set( 'views', dirname + '/views' );
    // app.set( "view engine", "html" );
    
    // set favicon
    // app.use( favicon( dirname + '/public/icon.ico' ) );
    
    // used for creating logs, the lib name is morgan
    app.use( logger( 'dev' ) );
    
    // allow parsing form data, required to send POST form directly to the server (like recoverPassword)
    // app.use( bodyParser.urlencoded( { extended: false } ) );
    
    // only use in development
    if ( 'development' == app.get( 'env' ) ) {
      app.use( errorHandler() )
    }
    
    // to busy handler, prevent server crash from overload
    app.use( function( req, res, next )
    {
      if ( toobusy() ) res.send( 503, "Server overload, try again later please. Sorry for inconvenience." );
      else next();
    } );
    return app;
  }
  
  return load_app;
});