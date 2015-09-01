define( [ 'config', 'shared', 'middlewares' ],
function( config, shared, middlewares )
{
  function bindSocket( socket )
  {
    socket.on( "tchat", middlewares.tchat );
    socket.on( "replay", function()
    {
      middlewares.respawn( socket );
    } );
    
    /*** send-input
     * when player send input
     * inputDate is the client Date
     */
      socket.on( "send-input", function( playerX, playerY, inputName, value, value2, inputDate )
      {
        if ( this.player.is_dead )
          return;
        
        // console.log( "send input " + this.myIndex );
        this.player.position.x = playerX;
        this.player.position.y = playerY;
        middlewares.checkPlayerLimits( this );
        if ( inputName == "axes" )
        {
          value = value > 1 ? 1 : value < -1 ? -1 : value;
          value2 = value2 > 1 ? 1 : value2 < -1 ? -1 : value2;
          this.player.axes = {
            'x': value !== null ? value : this.player.axes.x
            ,'y': value2 !== null ? value2 : this.player.axes.y
          };
          if ( this.player.axes.x < 0 )
            this.player.dir = -1;
          else if ( this.player.axes.x > 0 )
            this.player.dir = 1;
        }
        
        if ( !inputName )
          this.to( this.room ).emit( "update-input", this.myIndex, playerX, playerY );
        else
          this.to( this.room ).emit( "update-input", this.myIndex, playerX, playerY
            , inputName, value, value2 );
      } );
    
    socket.on( "toggle-candle", function()
    {
      this.player.candle = !this.player.candle;
      this.to( this.room ).emit( "toggle-candle", this.myIndex, this.player.candle );
      this.emit( "toggle-candle", this.myIndex, this.player.candle );
    } );
    
    socket.on( "use-action", function( myPosition, targetId, targetPosSent )
    {
      if ( this.player.is_dead || Date.now() - this.player.lastAction < this.player.delayBetweenAction )
        return;
      this.lastAction = Date.now();
      
      this.player.position.x = myPosition.x || this.player.position.x;
      this.player.position.y = myPosition.y || this.player.position.y;
      
      switch( this.player.type )
      {
        // sword attack
        case config.PLAYABLE_CLASSES.HUMAN:
          this.to( this.room ).emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
          this.emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
          middlewares.checkKill( this, targetId, targetPosSent );
          break;
        
        // try to eat someone
        case config.PLAYABLE_CLASSES.WOLF:
          if ( /* in darkness */ true ) // TODO - anti-hack security only
          {
            this.to( this.room ).emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
            this.emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
            middlewares.checkKill( this, targetId, targetPosSent );
          }
          break;
        
        // light up a candle for a while
        case config.PLAYABLE_CLASSES.LITTLE_GIRL:
          this.to( this.room ).emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
          this.emit( "used-action", this.myIndex, this.player.position.x, this.player.position.y );
          break;
      }
    } );
    /*** player-hit
     * one player hit an other trough physical attack (can be from monster)
     */
     
      // socket.on( "player-hit", middlewares.playerHit );
  }
  
  return bindSocket;
} );