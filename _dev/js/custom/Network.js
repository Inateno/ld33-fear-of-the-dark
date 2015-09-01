define( [ 'DREAM_ENGINE', 'config', 'shared' ],
function( DE, config, shared )
{
  var Network = new function()
  {
    var _socket;
    var _self = this;
    
    this.connectionInited = false;
    this.testConnectionInited = false;
    this.init = function()
    {
      var initSession = document.createElement( 'script' );
      initSession.src = config.app_url + ":" + config.app_port + '/hackInit';
      initSession.onload = function()
      {
        document.body.removeChild( initSession );
        _self.testConnectionInited = true;
        DE.trigger( "contact-server-success" );
        
        _self.triedFetch = false;
        _self.fetchIo();
      };
      initSession.onerror = function()
      {
        document.body.removeChild( initSession );
        _self.testConnectionInited = false;
        DE.trigger( "contact-server-fail" );
      };
      document.body.appendChild( initSession );
    };
    
    this.fetchIo = function( params )
    {
      Network.initParams = params;
      if ( !_self.testConnectionInited )
      {
        _self.triedFetch = true;
        this.init();
        return;
      }
      if ( window.io )
      {
        _self.initSocket( window.io );
        _self.rebindListener();
        _self.getPlayersOnline();
        return;
      }
      var tag = document.createElement( 'script' );
      tag.src = config.app_url + ":" + config.app_port + '/socket.io/socket.io.js';
      var oldDefine = window.define;
      window.define = undefined;
      tag.onload = function()
      {
        DE.trigger( "load-io-success" );
        console.log( '%cGet Socket.io !', "color:green" );
        _self.initSocket( io );
        window.define = oldDefine;
        _self.rebindListener();
        document.body.removeChild( tag );
        _self.getPlayersOnline();
      };
      tag.onerror = function()
      {
        DE.trigger( "load-io-fail" );
        document.body.removeChild( tag );
      };
      document.body.appendChild( tag );
    };
    
    this.getPlayersOnline = function()
    {
      console.log( "get players online" );
      var tag = document.createElement( 'script' );
      tag.src = config.app_url + ":" + config.app_port + '/nPlayers';
      tag.onload = function()
      {
        DE.trigger( "load-nplayers", window.nPlayersConnected || 0 );
        document.body.removeChild( tag );
      };
      tag.onerror = function()
      {
        _self.testConnectionInited = false;
        DE.trigger( "contact-server-fail" );
        document.body.removeChild( tag );
      };
      document.body.appendChild( tag );
    };
    
    this.initSocket = function( io )
    {
      console.log( "init socket" )
      // create socket
      _socket = io.connect( config.app_url + ":" + config.app_port );
      
      DE.on( "unload-game", function()
      {
        _socket.emit( "disconnect" );
      } );
      
      _socket.on( "hello", function()
      {
        Network.connectionInited = true;
      } );
      
      // then load the map where player is
      _socket.on( "welcome", function( level, level_components, components, players, classes, highscores )
      {
        // DE.LangSystem.addDictionary( dictionary );
        shared.components = components;
        shared.level_components = level_components;
        
        DE.trigger( "scores-update", highscores );
        DE.trigger( "data-loaded", level, players );
      } );
      
      _socket.on( "reset-input", function( x, y, playerId )
      {
        var pl = shared.players[ playerId ];
        pl.position.setPosition( x >> 0, y >> 0 );
        pl.axes          = { x: 0, y: 0 };
        pl.isDead        = false;
      } );
      
      _socket.on( "update-input", function( playerId, x, y, inputName, value, value2 )
      {
        var pl = shared.players[ playerId ];
        if ( !pl || !pl.enable )
          return;
        
        // smooth but buggy
        // pl.moveTo( { 'x': x, 'y': y }, 100 );
        pl.position.x = x >> 0;
        pl.position.y = y >> 0;
        
        if ( !inputName )
          return;
        
        if ( inputName == "axes" )
        {
          pl.updateAxes( value, value2 );
        }
        else
        {
          // switch( inputName )
          // {
          // }
        }
      } );
    };
    
    this.send = function( packetName )
    {
      _socket.emit.apply( _socket, arguments );
    };
    
    var _toListen = {};
    this.rebindListener = function()
    {
      if ( !_socket )
      {
        console.log("%cWoops, tried to bind listeners, but no socket", "color: orange" );
        return;
      }
      for ( var i in _toListen )
        this.listen( _toListen[ i ][ 0 ], _toListen[ i ][ 1 ], _toListen[ i ][ 2 ], i );
      _toListen = {};
    };
    this.listen = function( packetName, callback, context )
    {
      context = context || window;
      if ( !_socket )
      {
        var timestamp = Date.now() + ( Math.random() * Date.now() >> 0 );
        _toListen[ timestamp ] = [ packetName, callback, context ];
        return;
      }
      _socket.on( packetName, function()
      {
        // console.log( "%cPacket enter :: " + packetName, "color: orange" );
        // console.log( arguments );
        callback.apply( context, arguments );
      } );
    };
  }
  DE.Event.addEventCapabilities( Network );
  
  return Network;
} );