define( [ 'shared' ],
function( shared )
{
  function tchat( message, fromServer )
  {
    if ( !message )
      return;
    
    if ( fromServer )
    {
      this.to( this.room ).emit( "tchat", "server", message );
      return;
    }
    
    // tchat commands
    if ( message[ 0 ] == "/" )
    {
      message = message.replace( "/", "" ).split( " " );
      switch( message[ 0 ].toLowerCase() )
      {
        // WHISPER
        case "w":  
        case "mp":
        case "dm":
        case "whisper":
          if ( message.length < 3 )
            return;
          var pid = shared.byNick[ message[ 1 ] ];  // nickname
          if ( pid == this.myIndex )
            return;
          if ( pid && shared.players[ pid ] )
          {
            var msg = "";
            for ( var i = 2; i < message.length; ++i )
              msg += message[ i ] + " ";
            console.log( shared.players[ this.myIndex ].nick + " whisper "+ msg + " to " + message[ 1 ] );
            this.emit( "tchat-whisper", pid, msg, true );
            shared.users[ pid ].socket.emit( "tchat-whisper", this.myIndex, msg, false );
          }
          else
            this.emit( "tchat-whisper-fail", "Cannot find the user" );
          break;
        
        // LIST
        case "list":
        case "players":
        case "listplayers":
        case "whoisonline":
          var nb = 0;
          var playerList = "";
          
          for ( var s in shared.players )
          {
            playerList += "-"+shared.players[ s ].nick + "%br%";
            nb++;
          }
          var msgHeader = "Players online [" + nb + "] : %br%";
          
          this.emit( "tchat-command", msgHeader + playerList );
          break;
        
          case "where":
          case "whereis":
            if ( message.length < 2 )
              return;
            var pid = shared.byNick[ message[ 1 ] ];  // nickname
            
            if ( !shared.users[ pid ] ) //if player does not exist
            {
              this.emit( "tchat-command", "Player " + message[ 1 ] + " offline." );
            }
            else
            {
              var msg = "Player " + message[ 1 ] + " is in ";
              var pos = levels[ shared.players[ pid ].currentMap ].name + " at " +
                ( shared.players[ pid ].x >> 0 ) + ", "+ (shared.players[ pid ].y >> 0 );
              this.emit( "tchat-command", msg + pos );
            }              
          break;
          
        case "commands":
        case "help":
          var msg = "commands are : %br%\
          /list to list players in the game%br%\
          /listplayers to list players in the game%br%\
          /whoisonline to list players in the game%br%\
          /whoisonline to list players in the game%br%\
          /mp SOMEONE to send a direct message to SOMEONE%br%\
          /dm SOMEONE to send a direct message to SOMEONE%br%\
          /whisper SOMEONE to send a direct message to SOMEONE%br%\
          /w SOMEONE to send a direct message to SOMEONE%br%\
          /gainxp SOMEONE NB to SOMEONE gain NB experience points. (only admin)%br%\
          /where SOMEONE to know the map name and position of SOMEONE%br%\
          /whereis SOMEONE to know the map name and position of SOMEONE%br%\
          /help list all available commands%br%\
          /commands list all available commands%br%";
          
          this.emit( "tchat-command", msg );
          break;
          
        default:
          this.emit( "tchat-command", msg );
      }
      return;
    }
    
    // console.log( "receive tchat message from " + this.player.nick, message );
    this.to( this.room ).emit( "tchat", this.myIndex, message );
    this.emit( "tchat", this.myIndex, message );
  }
  
  return tchat;
} );