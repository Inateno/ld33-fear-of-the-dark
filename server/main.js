var requirejs = require( 'requirejs' );

requirejs.config( {
  paths: {
    "config"                   : "server_conf/config"
    ,"load_app"                : "server_conf/load_app"
    ,"load_router"             : "server_conf/load_router"
    ,"load_server"             : "server_conf/load_server"
    ,"load_sockets"            : "server_conf/load_sockets"
    ,"logger"                  : "server_conf/logger"
    ,"shared"                  : "server_conf/shared"
    ,"init"                    : "init"
    ,"bindConnectedSocket"     : "bindConnectedSocket"
    
    // mids
    ,"middlewares"             : "middlewares/middlewares"
    ,"mid.checkPlayerLimits"   : "middlewares/checkPlayerLimits"
    ,"mid.tchat"               : "middlewares/tchat"
    ,"mid.respawn"             : "middlewares/respawn"
    ,"mid.checkHighScore"      : "middlewares/checkHighScore"
    ,"mid.checkKill"           : "middlewares/checkKill"
    
    // routes
    ,"routes"                  : "server_conf/routes/routes"
  }
  , nodeRequire: require
} );

requirejs( [ "config", "colors", "load_app", "load_router", "load_server", "load_sockets", "init", "logger", "shared", "fs" ],
function( config, colors, load_app, load_router, load_server, load_sockets, init, logger, shared, fs )
{
  colors.setTheme( {
    silly  : 'rainbow',
    input  : 'grey',
    verbose: 'cyan',
    prompt : 'grey',
    info   : 'green',
    data   : 'grey',
    help   : 'cyan',
    warn   : 'yellow',
    debug  : 'blue',
    error  : 'red'
  } );
  
  logger( __dirname );
  console.logger = logger;
  console.logger( "trace", "Launch the Hunter & Hunted server" );
  
  var app = load_app( __dirname ); // load express and conf
  load_router( app );   // configure routing
  var server = load_server( app ); // load server
  var sockets = load_sockets( server ); // load sockets conf
  
  fs.readFile( "KILLS.json", 'utf8', function ( err, data )
  {
    if ( err )
    {
      console.logger( "fatal", "get KILLS error on get file " + err );
      return;
    }
    shared.globalScore = JSON.parse( data );
  } );
  fs.readFile( "SCORES.json", 'utf8', function ( err, data )
  {
    if ( err )
    {
      console.logger( "fatal", "get SCORES error on get file " + err );
      return;
    }
    shared.highscores = JSON.parse( data );
  } );
  
  init( sockets, app, server, __dirname );
} );