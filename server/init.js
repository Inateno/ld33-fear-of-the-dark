define( [ "config", "shared", "middlewares", "bindConnectedSocket" ],
function( config, shared, middlewares, bindConnectedSocket )
{
  var sessions = shared.sessions;
  var players  = shared.players;
  
  // this file bind basic socket packets, advanced packets binded in biindConnectedSocket
  var init = function( sockets, app, server, dirname )
  {
    console.log( "Server init ended, enable sockets" );
    
    sockets.on( "connection", function( socket )
    {
      console.log( "connection !" );
      socket.indexId = shared.nConnections++;
      socket.user_ip = socket.request.connection.remoteAddress;
      socket.player = null;
      
      var _isNew = false;
      if ( !sessions[ socket.sessionID ] )
      {
        _isNew = true;
        sessions[ socket.sessionID ] = {
          times: 0, player: null
          , lang: null, socket: socket
          , sessionID: socket.sessionID, online: true
        };
      }
      else
      {
        console.log( "double connection, destroy previous" );
        sessions[ socket.sessionID ].socket.emit( "force-disconnect" );
        sessions[ socket.sessionID ].socket.leaveAll();
        sessions[ socket.sessionID ].socket.disconnect();
        if ( sessions[ socket.sessionID ].player )
          delete players[ sessions[ socket.sessionID ].player.id ];
        sessions[ socket.sessionID ].socket = socket;
      }
      socket.session = sessions[ socket.sessionID ];
      socket.session.times++;
      socket.session.inited = false;
      
      socket.on( "disconnect", function()
      {
        // wtf ?
        if ( !this.myIndex )
          return;
        
        this.session.online = false;
        this.to( this.room ).emit( "player-leave", this.myIndex );
        this.leave( this.room );
        
        delete shared.players[ this.myIndex ];
        shared.nPlayers--;
        
        if ( shared.nPlayers < 0 )
          shared.nPlayers = 0;
      } );
      
      /***
       * = login
       * user client is ready and want to join, init the game
       */
      socket.on( "login", function( nick, country )
      {
        // this prevent users who click tons of times on "play" button
        if ( this.inited )
          return;
        
        if ( !nick || !nick.toString )
          nick = "Guest-" + ( shared.guestCounter++ );
        
        if ( shared.players[ nick.toLowerCase() ] || config.reservedWords.indexOf( nick.toLowerCase() ) != -1 )
        {
          this.emit( "nick-not-available" );
          return;
        }
        
        console.log( "init connection for user: " + nick );
        
        this.inited = true;
        
        this.player = {
          nick       : nick
          ,id        : nick.toLowerCase()
          ,country   : country
          ,position  : { x: 0, y: 0 }
          ,axes      : { x: 0, y: 0 }
          ,type      : config.PLAYABLE_CLASSES.HUMAN
          ,score     : 0
          ,last_score: 0
          ,highscore : 0
          ,candle    : true
          ,is_dead   : true
          ,sprite    : "human"
          ,monsterSprite     : null
          ,lastAction        : Date.now()
          ,delayBetweenAction: 2000
        };
        
        this.session.player = this.player;
        
        shared.playersSession[ this.player.id ] = this.session;
        shared.players[ this.player.id ] = this.player;
        
        this.myIndex = this.player.id;
        
        // generate which class we play
        middlewares.respawn( this, true ); // false to prevent direct sending data because we are sending it below
        
        this.emit( "glob-score-monsters", shared.globalScore.monsters );
        this.emit( "glob-score-humans", shared.globalScore.humans );
        
        this.to( this.room ).emit( "player-join", this.player );
        this.emit( "player-loaded", this.player );
        shared.nPlayers++;
        
        var clock = new Date( Date.now() ).getHours() + ":" + new Date( Date.now() ).getMinutes();
        console.log( "[" + clock + "] " + this.player.nick + " has join the game" );
        
        bindConnectedSocket( this );
      } );
      
      console.log( "send hello" );
      socket.emit( "hello", _isNew ); // enable connexion client-side and send if this user is new
      
      socket.join( "main" );
      socket.room = "main";
      // TODO don't send all raw players, we should remove if they are monster
      socket.emit( "welcome", shared.level, shared.level_components, shared.components, shared.players, shared.classes, shared.highscores );
    } );
  };
  
  return init;
} );