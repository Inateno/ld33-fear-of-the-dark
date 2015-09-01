define( [ 'DREAM_ENGINE', 'shared', 'config', 'Network' ],
function( DE, shared, config, Network )
{
  function Character( playerData )
  {
    DE.GameObject.call( this, {
      "x" : playerData.position.x
      ,"y": playerData.position.y
      ,"tag"     : "player"
      ,"zindex"  : 5
      ,"renderers": [
        new DE.SpriteRenderer( { "spriteName": playerData.sprite || "human", normal: ( playerData.sprite || "human" ) + "-norm" } )
        // , new DE.TextRenderer( playerData.nick, { "fill": "white", "name": "nickText", "y": -120, "fontSize": 18, alpha: 0.5 } )
      ]
      ,"collider": new DE.FixedBoxCollider( 50, 50, { y: 35 } )
    } );
    // this.renderers[ 1 ].alpha = 0.1;
    
    var _self = this;
    
    this.axes    = { x: 0, y: 0 };
    this.isDead  = false;
    this.id      = playerData.id;
    this.nick    = playerData.nick;
    this.score   = 0;
    this.type    = playerData.type;
    this.speed   = config.classes[ config.classes_name[ this.type ] ].speed;
    this.lastAction         = Date.now();
    this.delayBetweenAction = config.classes[ config.classes_name[ this.type ] ].delayBetweenAction;
    
    this._actionFxs = config.classes[ config.classes_name[ this.type ] ].actionFxs;
    this._deathFxs  = config.classes[ config.classes_name[ this.type ] ].deathFxs;
    
    this.wasInLight         = true;
    this.monsterSprite      = playerData.monsterSprite;
    this.humanSprite        = playerData.sprite;
    
    // ATTACK STUFF
      this.attackCollider = new DE.CircleCollider( config.attackRange );
      this.attackCollider.gameObject = this;
      
      this.attackSprite = new DE.GameObject( {
        renderer: new DE.SpriteRenderer( { spriteName: this.monsterSprite ? "wolf_attack" : "sword_attack" } )
      } );
      this.attackSprite.enable = false;
      this.add( this.attackSprite );
    
    // BLOOD
      this.deadSprite = new DE.GameObject( {
        renderer: new DE.SpriteRenderer( { spriteName: "blood_fx" } )
      } );
      this.deadSprite.enable = false;
      this.deadSprite.focus( this );
    
    // CANDLE
      this.candle = new DE.GameObject( {
        zindex: 100, x: 0, y: 0
        ,renderer: new DE.PIXI.lights.PointLight( 0xF99519, 0.7 )
        ,collider: new DE.CircleCollider( 150 )
      } );
      this.candle.dir = 1;
      this.candle.wobble = function()
      {
        this.renderer._colorRgba[ 3 ] += ( Math.random() * 0.01 + 0.001 ) * this.dir;
        
        if ( this.renderer._colorRgba[ 3 ] > 1 )
        {
          this.dir = -this.dir;
          this.renderer._colorRgba[ 3 ] = 1;
        }
        if ( this.renderer._colorRgba[ 3 ] < 0.6 )
        {
          this.dir = -this.dir;
          this.renderer._colorRgba[ 3 ] = 0.6;
        }
      }
      this.candle.addAutomatism( "wobble", "wobble" );
      this.add( this.candle );
    
    // CLOUD FOR MONSTER WHEN APPEAR/DISAPEAR
      this.cloud = new DE.GameObject( {
        renderer: new DE.SpriteRenderer( { spriteName: "cloud_fx" } )
      } );
      this.cloud.enable = false;
      this.cloud.renderer.onAnimEnd = function()
      {
        this.gameObject.fadeOut();
      };
      this.add( this.cloud );
    
    if ( this.id == shared.myIndex )
    {
      this.monsterView = new DE.GameObject( {
        renderer: new DE.PIXI.lights.AmbientLight( 0xff7777, 0.37 )
      } );
      this.add( this.monsterView );
    }
    
    // player respawn
    this.respawn = function( newData )
    {
      this.position.setPosition( newData.position );
      this.type    = newData.type;
      this.score   = 0;
      this.speed   = config.classes[ config.classes_name[ this.type ] ].speed;
      this.lastAction         = Date.now();
      this.delayBetweenAction = config.classes[ config.classes_name[ this.type ] ].delayBetweenAction;
      
      this._actionFxs = config.classes[ config.classes_name[ this.type ] ].actionFxs;
      this._deathFxs  = config.classes[ config.classes_name[ this.type ] ].deathFxs;
      
      this.wasInLight         = true;
      this.monsterSprite      = newData.monsterSprite;
      this.humanSprite        = newData.sprite;
      
      this.deadSprite.enable = false;
      this.attackSprite.enable = false;
      this.cloud.enable = false;
      
      this.renderer.changeSprite( this.humanSprite, { normal: this.humanSprite + "-norm" } );
      if ( this.monsterSprite )
      {
        this.attackSprite.renderer.changeSprite( "wolf_attack" );
        if ( this.id == shared.myIndex )
          this.monsterView.enable = true;
      }
      else
      {
        this.attackSprite.renderer.changeSprite( "sword_attack" );
        if ( this.id == shared.myIndex )
          this.monsterView.enable = false;
      }
      
      this.candle.enable = newData.candle;
      if ( this.isDead )
        this.candle.enable = true;
      
      this.isDead = false;
      this.enable = true;
    }
    this.respawn( playerData );
    
    this.makeCollision = function(lastPos,newPos)
    {
      for ( var i = 0, c; c = this.scene.colliders[ i ]; ++i )
      {
        if ( DE.CollisionSystem.fixedBoxCollision ( this.collider, c.collider ) )
        {
          this.x = lastPos.x;
          if ( DE.CollisionSystem.fixedBoxCollision ( this.collider, c.collider ) )
          {
            this.y = lastPos.y;
            this.x = this.newPos.x;
            if ( DE.CollisionSystem.fixedBoxCollision ( this.collider, c.collider ) )
              this.x = lastPos.x;
          }
        }
      }
    }
    
    this.lastSend = Date.now();
    
    this.logic = function()
    {
      this.logicBefore();
      
      this.lastPos = { x: this.x, y: this.y };
      this.translate( { x: this.axes.x * this.speed, y: this.axes.y * this.speed }, true );
      this.newPos = { x: this.x, y: this.y };
      
      this.makeCollision( this.lastPos ,{ x: this.x, y: this.y } );
      
      if ( this.axes.x != 0 || this.axes.y != 0 )
      {
        this.renderer.setPause( false );
        if ( this.id == shared.myIndex && Date.now() - this.lastSend > 50 )
        {
          Network.send( "send-input", this.position.x, this.position.y );
          this.lastSend = Date.now();
        }
      }
      else
        this.renderer.setPause( true );
      
      // if player is a monster and enter in a light zone, he change to human form
      if ( config.monsters.indexOf( this.type ) != -1 )
      {
        var insideLight = false;
        for ( var i = 0, l; l = this.scene.lights[ i ]; ++i )
        {
          // if ( l.owner && ( l.owner == this.id || config.monsters.indexOf( shared.players[ l.owner ].type ) != -1 ) )
          //   continue;
          if ( DE.CollisionSystem.pointCircleCollision( this.position, l.collider ) )
          {
            insideLight = true;
            break;
          }
        }
        
        if ( !this.automatism[ "setInLight" ] )
          this.addAutomatism( "setInLight", "setInLight", { value1: insideLight, interval: 350, persistent: false } );
      }
      
      this.logicAfter();
    };
    
    this.setInLight = function( insideLight )
    {
      // go to monster form
      if ( !insideLight && this.renderer.spriteName !== this.monsterSprite )
        this.renderer.changeSprite( this.monsterSprite, { normal: this.monsterSprite + "-norm" } );
      else if ( insideLight && this.renderer.spriteName !== this.humanSprite )
        this.renderer.changeSprite( this.humanSprite, { normal: this.humanSprite + "-norm" } );
      
      if ( this.wasInLight != insideLight )
      {
        this.cloud.enable = true;
        this.cloud.alpha = 1;
        this.cloud.renderer.restartAnim();
      }
      this.wasInLight = insideLight;
    };
    
    this.addAutomatism( "logic", "logic" );
    
    if ( shared.myIndex == this.id )
    {
      function quickSend( valX, valY )
      {
        if ( valX !== null )
        {
          if ( valX == _self.axes.x )
            return;
          // if the value isn't a "sure" value, check the gap difference
          // if is to low to calculate it
          if ( valX != 0.5 && valX != 1 && valX != -1 && valX !== 0
            && ( ( _self.axes.x === 0 && valX < 0.2 && valX > -0.2 )
            || ( _self.axes.x == 0.5 && valX < 0.75 )
            || ( _self.axes.x == -0.5 && valX > -0.75 )
            || ( _self.axes.x == 1 && valX > 0.75 )
            || ( _self.axes.x == -1 && valX < -0.75 ) ) )
            return;
          
          // improve packet with 5 values possible
          if ( valX > 0.75 )
            valX = 1;
          else if ( valX > 0.2 )
            valX = 0.5;
          else if ( valX < -0.75 )
            valX = -1;
          else if ( valX < -0.2 )
            valX = -0.5;
          else
            valX = 0;
          
          if ( valX == _self.axes.x )
            return;
        }
        if ( valY !== null )
        {
          if ( valY == _self.axes.y )
            return;
          if ( valY != 0.5 && valY != 1 && valY != -1 && valY !== 0
            && ( ( _self.axes.y === 0 && valY < 0.2 && valY > -0.2 )
            || ( _self.axes.y == 0.5 && valY < 0.75 )
            || ( _self.axes.y == -0.5 && valY > -0.75 )
            || ( _self.axes.y == 1 && valY > 0.75 )
            || ( _self.axes.y == -1 && valY < -0.75 ) ) )
            return;
          
          if ( valY > 0.75 )
            valY = 1;
          else if ( valY > 0.2 )
            valY = 0.5;
          else if ( valY < -0.75 )
            valY = -1;
          else if ( valY < -0.2 )
            valY = -0.5;
          else
            valY = 0;
          
          if ( valY == _self.axes.y )
            return;
        }
        _self.lastSend = Date.now();
        Network.send( "send-input", _self.position.x, _self.position.y, "axes", valX, valY, Date.now() );
        _self.updateAxes( valX, valY );
      }
      
      DE.Inputs.on( "keyDown", "0-candle", function(){ Network.send( "toggle-candle" ); } );
      DE.Inputs.on( "keyDown", "0-action", function(){ _self.useAction(); } );
      DE.Inputs.on( "keyDown", "0-down", function( valY ){ quickSend( null, valY ); } );
      DE.Inputs.on( "keyDown", "0-left", function( valX ){ quickSend( -valX, null ); } );
      DE.Inputs.on( "keyDown", "0-right", function( valX ){ quickSend( valX, null ); } );
      DE.Inputs.on( "keyDown", "0-up", function( valY ){ quickSend( null, -valY ); } );
      DE.Inputs.on( "keyUp", "0-down", function( valY )
      {
        if ( DE.Inputs.key( "0-up" ) )
          quickSend( null, -1 );
        else
          quickSend( null, 0 );
      } );
      DE.Inputs.on( "keyUp", "0-left", function( valX )
      {
        if ( DE.Inputs.key( "0-right" ) )
          quickSend( 1, null );
        else
          quickSend( 0, null );
      } );
      DE.Inputs.on( "keyUp", "0-right", function( valX )
      {
        if ( DE.Inputs.key( "0-left" ) )
          quickSend( -1, null );
        else
          quickSend( 0, null );
      } );
      DE.Inputs.on( "keyUp", "0-up", function( valY )
      {
        if ( DE.Inputs.key( "0-down" ) )
          quickSend( null, 1 );
        else
          quickSend( null, 0 );
      } );
      
      DE.Inputs.on( "axeMoved", "0-haxe", function( val ){ quickSend( val, null ); } );
      DE.Inputs.on( "axeMoved", "0-vaxe", function( val ){ quickSend( null, val ); } );
      DE.Inputs.on( "axeStop", "0-haxe", function(){ quickSend( 0, null ); } );
      DE.Inputs.on( "axeStop", "0-vaxe", function(){ quickSend( null, 0 ); } );
    }
  }
  
  Character.prototype = Object.create( DE.GameObject.prototype );
  Character.prototype.constructor = Character;
  
  // getter setters
  Object.defineProperties( Character.prototype, {
    
  } );
  
  // overwrite this to add animation or game-over or win etc..
  Character.prototype.death = function()
  {
    this.isDead = true;
    alert( "dead" );
  };
  
  // overwrite this in children classes if needed
  Character.prototype.logicBefore = function(){};
  Character.prototype.logicAfter = function(){};
  
  // set correctly currentLine on spriteSheet
  Character.prototype.updateAnim = function()
  {
    if ( !this.renderer.totalLine || this.renderer.totalLine == 1 )
      return;
    if ( this.axes.x > 0 )
      this.renderer.setLine( 2 );
    else if ( this.axes.x < 0 )
      this.renderer.setLine( 1 );
    else if ( this.axes.y < 0 )
      this.renderer.setLine( 3 );
    else
      this.renderer.setLine( 0 );
  };
  
  // want to act, send it to server
  Character.prototype.useAction = function()
  {
    // monster cannot do anything in light
    if ( this.monsterSprite && this.wasInLight )
      return;
    
    if ( Date.now() - this.lastAction < this.delayBetweenAction )
      return;
    this.lastAction = Date.now();
    
    var pid = null;
    switch( this.type )
    {
      // sword attack
      case config.PLAYABLE_CLASSES.HUMAN:
      case config.PLAYABLE_CLASSES.WOLF:
        for ( var i in shared.players )
        {
          // cannot kill other monsters
          if ( i == shared.myIndex || ( this.monsterSprite && shared.players[ i ].monsterSprite ) )
            continue;
          
          if ( DE.CollisionSystem.pointCircleCollision( shared.players[ i ], this.attackCollider ) )
          {
            pid = i;
            break;
          }
        }
        break;
    }
    
    if ( pid )
      Network.send( "use-action", { x: this.position.x, y: this.position.y }, pid, { x: shared.players[ pid ].position.x, y: shared.players[ pid ].position.y } );
    else
      Network.send( "use-action", { x: this.position.x, y: this.position.y } );
  };
  
  // receive from server to play action animation for this character
  Character.prototype.playAction = function()
  {
    this.lastAction = Date.now();
    
    if ( this.id != shared.myIndex && !this.position.isInRangeFrom( shared.players[ shared.myIndex ].position, 1000 ) )
      return;
    
    if ( this._actionFxs.length )
      DE.AudioManager.fx.play( this._actionFxs[ Math.random() * this._actionFxs.length >> 0 ] );
    
    switch( this.type )
    {
      // sword attack
      case config.PLAYABLE_CLASSES.WOLF:
      case config.PLAYABLE_CLASSES.HUMAN:
      // try to eat someone
        this.attackSprite.renderer.restartAnim();
        this.attackSprite.alpha = 1;
        this.attackSprite.enable = true;
        this.attackSprite.addAutomatism( "fadeOut", "fadeOut", { interval: 500, persistent: false } );
        break;
      
      // light up a candle for a while
      case config.PLAYABLE_CLASSES.LITTLE_GIRL:
        // TODO candle for little girl should be seen by everyone when is it activated
        // this.candle.scaleTo( 4, 1500 );
        // this.candle.addAutomatism( "scaleTo", "scaleTo", {
        //   value1: 0, value2: 1500, interval: this.delayBetweenAction, persistent: false
        // } );
        break;
    }
  };
  
  Character.prototype.toggleCandle = function( value )
  {
    this.candle.enable = value;
    
    if ( this.id == shared.myIndex || this.position.isInRangeFrom( shared.players[ shared.myIndex ].position, 1000 ) )
    {
      if ( value )
        DE.AudioManager.fx.play( "candle_on" );
      else
        DE.AudioManager.fx.play( "candle_off" );
    }
   };
   
  // when is killed
  Character.prototype.die = function()
  {
    // TODO play blood animation
    this.deadSprite.renderer.restartAnim();
    this.deadSprite.enable = true;
    
    if ( this.id != shared.myIndex && !this.position.isInRangeFrom( shared.players[ shared.myIndex ].position, 1000 ) )
      return;
    
    if ( this._deathFxs.length )
      DE.AudioManager.fx.play( this._deathFxs[ Math.random() * this._deathFxs.length >> 0 ] );
    
    this.isDead = true;
    this.enable = false;
  };
  
  // here update axes bind this on control to move the character
  Character.prototype.updateAxes = function( x, y )
  {
    this.axes = {
      'x': x !== null ? x : this.axes.x
      ,'y': y !== null ? y : this.axes.y
    };
    
    if ( Math.abs( this.axes.x ) + Math.abs( this.axes.y ) > 1 )
    {
      this.axes.x = 0.5 * this.axes.x > 0 ? 1 : -1;
      this.axes.y = 0.5 * this.axes.y > 0 ? 1 : -1;
    }
    
    this.trigger( "updateAxes" );
    this.updateAnim();
  };
  
  return Character;
} );