/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/
define( [ 'DREAM_ENGINE', 'config', 'shared', 'Network', 'Character', 'windowLogin', 'windowGame', 'windowScores', 'windowEnd', 'tchat' ],
function( DE, config, shared, Network, Character, windowLogin, windowGame, windowScores, windowEnd, tchat )
{
  var Game = {};
    
  Game.render  = null;
  Game.scene  = null;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DE.CONFIG.DEBUG = 0;
    DE.CONFIG.DEBUG_LEVEL = 0;
    // render
    Game.render = new DE.Render( "render", {  backgroundColor: "0x190916", fullScreen: "ratioStretch", width: config.screenWidth, height: config.screenHeight } );
    
    Game.render.pixiRenderer = new DE.PIXI.lights.WebGLDeferredRenderer( config.screenWidth, config.screenHeight, {
      backgroundColor: "0x190916", transparent: false, clearBeforeRender: false
    } );
    Game.render.pixiRenderer.plugins[ 'interaction' ].removeEvents();
    Game.render.pixiRenderer.plugins[ 'interaction' ].destroy();
    delete Game.render.pixiRenderer.plugins[ 'interaction' ];
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game start!!" );
    Game.scene = new DE.Scene( "Test" );
    Game.scene.colliders = [];
    Game.scene.lights = [];
    Game.camera = new DE.Camera( config.screenWidth, config.screenHeight, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(0,0,0)" } );
    // Game.camera.sceneContainer.z = 30;
    Game.camera.scene = Game.scene;
    
    var back = new DE.GameObject( {
      renderer: new DE.SpriteRenderer( { spriteName: "LD", normal: "LD-norm", scale: 1 } )
      // renderer : new DE.PIXI.extras.TilingSprite( DE.PIXI.utils.TextureCache[ DE.PIXI.loader.resources[ "floor" ].url ], 3200, 3200 )
    } );
    // back.renderer.normalTexture = DE.PIXI.utils.TextureCache[ DE.PIXI.loader.resources[ "floor-norm" ].url ];
    // window.back = back;
    Game.scene.add( back );
    Game.render.add( Game.camera );
    
    var toggleAudio = document.getElementById( "toggleAudio" );
    toggleAudio.addEventListener( "pointerup", function()
    {
      DE.AudioManager.toggle();
      if ( DE.AudioManager.muted )
        toggleAudio.className += "active";
      else
        toggleAudio.className = toggleAudio.className.replace( "active", "" );
    } );
    
    /**/
    
    
    // stuff order
      // display a background image + loading = server connexion
      
      // TODO - update loading status
      DE.on( "contact-server-fail", function()
      {
        if ( confirm( "Server contact failed, this game require port " + config.app_port + ", also the server is maybe down due to a bug :3 -- try again in 10 seconds ?" ) )
          setTimeout( Network.init, 10000 );
      } );
      DE.on( "contact-server-success", function()
      {
        console.log( "Connected to server" );
        tchat.init();
        tchat.show();
      } );
      
      // when game data is loaded from server
      DE.on( "data-loaded", function( level, players )
      {
        console.log( "data loaded" );
        loadMap( level, players );
        windowLogin.show();
        windowScores.show();
      } );
    
    /** network stuff **/
      // when an other player join
      Network.listen( "player-join", function( player )
      {
        shared.players[ player.id ] = new Character( player );
        Game.scene.lights.push( shared.players[ player.id ].candle );
        tchat.command( shared.players[ player.id ].nick + " join" );
        
        Game.scene.add( shared.players[ player.id ], shared.players[ player.id ].deadSprite );
      } );
      // when I join
      Network.listen( "player-loaded", function( myPlayer )
      {
        console.log( "player loaded" )
        shared.myIndex = myPlayer.id;
        shared.nick = myPlayer.nick;
        shared.players[ myPlayer.id ] = new Character( myPlayer );
        
        DE.trigger( "show-my-card" );
      } );
      // disconnect
      Network.listen( "player-leave", function( playerId )
      {
        tchat.command( shared.players[ playerId ].nick + " left" );
        Game.scene.lights.splice( Game.scene.lights.indexOf( shared.players[ playerId ].candle ), 1 );
        shared.players[ playerId ].deadSprite.askToKill();
        shared.players[ playerId ].askToKill();
        shared.players[ playerId ] = null;
        delete shared.players[ playerId ];
      } );
      // an other player respawn
      Network.listen( "player-respawn", function( playerId, newData )
      {
        shared.players[ playerId ].respawn( newData );
      } );
      // you respawn
      Network.listen( "respawn", function( myData )
      {
        shared.players[ shared.myIndex ].respawn( myData );
        DE.trigger( "show-my-card" );
      } );
      
      // when a player use his action, everyone receive it
      Network.listen( "used-action", function( pid, x, y )
      {
        shared.players[ pid ].position.setPosition( x, y );
        shared.players[ pid ].playAction();
      } );
      Network.listen( "toggle-candle", function( id, value )
      {
        shared.players[ id ].toggleCandle( value );
      } );
      
      Network.listen( "player-die", function( pid, myScore )
      {
        shared.players[ pid ].die();
        if ( myScore )
          shared.players[ shared.myIndex ].score = myScore;
        if ( pid == shared.myIndex )
          DE.trigger( "die", shared.players[ shared.myIndex ].score );
      } );
    
    Game.camera.limits = {
      maxX : 1600
      ,minX: -1600
      ,maxY: 1600
      ,minY: -1600
    };
    
    // Game.scene.add( new DE.GameObject( {
    //   zindex: 2
    //   ,"renderer": new DE.SpriteRenderer( { "spriteName": "bg-temp", normal: "bg-temp-norm" } )
    // } ) );
    
    DE.on( "start-play", function()
    {
      // back.focus( shared.players[ shared.myIndex ] );
      Game.scene.lights.push( shared.players[ shared.myIndex ].candle );
      Game.scene.add( shared.players[ shared.myIndex ] );
      Game.camera.focus( shared.players[ shared.myIndex ] );
    } );
    
    // point light example
    // Game.scene.add( new DE.GameObject( { zindex: 100, x: 200, y: 200, renderer: new DE.PIXI.lights.PointLight(0xffffff,5) } )
    // , new DE.GameObject( { zindex: 100, x: 600, y: 200, renderer: new DE.PIXI.lights.PointLight(0xffffff,5) } )
    // , new DE.GameObject( { zindex: 100, x: 600, y: 600, renderer: new DE.PIXI.lights.PointLight(0xffffff,5) } )
    // , new DE.GameObject( { zindex: 100, x: 200, y: 600, renderer: new DE.PIXI.lights.PointLight(0xffffff,5) } ) );
    
    DE.AudioManager.music.volume = 60;
    DE.AudioManager.music.stopAllAndPlay( "game_music" );
    setTimeout( function(){
      DE.States.down( "isLoading" );
      Network.init();
    }, 500 );
  };
  
  function loadMap( level, players )
  {
    // load level
    var level_object = [];
    var object, children;
    for ( var i = 0, el, c = 0, dat, child; el = level[ i ]; ++i )
    {
      object = new DE.GameObject( {
        x: el.x, y: el.y, zindex: el.zindex
      } );
      
      dat = shared.components[ el.component ];
      if ( dat.r )
      {
        object.addRenderer( new DE.PIXI.lights.PointLight( dat.color,dat.force ) );
        object.setCollider( new DE.CircleCollider( dat.r ) );
        Game.scene.lights.push( object );
      }
      // is something with fixed box
      else if ( dat.w && dat.h )
      {
        // TODO - add a switch for switch and doors that work in a different way
        object.setCollider( new DE.FixedBoxCollider( dat.w, dat.h ) );
        Game.scene.colliders.push( object );
      }
      
      // children = shared.level_components[ el.component ];
      // for ( c = 0; c < children.length; ++c )
      // {
      //   dat = shared.components[ children[ c ].type ];
      //   child = new DE.GameObject( {
      //      "x": children[ c ].x
      //     ,"y": children[ c ].y
      //     ,"renderer": new DE.SpriteRenderer( { spriteName: children[ c ].type } )
      //   } );
        
      //   // is a light with a radius
      //   if ( dat.r )
      //   {
      //     child.setCollider( new DE.CircleCollider( dat.r ) );
      //     child.alpha = 0.55;
      //     child.renderer.blendMode = DE.PIXI.BLEND_MODES.ADD;
      //     Game.scene.lights.push( child );
      //   }
      //   // is something with fixed box
      //   else if ( dat.w && dat.h )
      //   {
      //     // TODO - add a switch for switch and doors that work in a different way
      //     child.setCollider( new DE.FixedBoxCollider( dat.w, dat.h ) );
      //     Game.scene.colliders.push( child );
      //   }
        
      //   object.add( child );
      // }
      Game.scene.add( object );
    }
    
    for ( var n in players )
    {
      // Character monster ?? think about this, you shouldn't know what the other "are" but they do and server do too
      // but if we want to show to other players a monster, we have to know it
      shared.players[ n ] = new Character( players[ n ] );
      Game.scene.lights.push( shared.players[ n ].candle );
      Game.scene.add( shared.players[ n ], shared.players[ n ].deadSprite );
    }
  }
  
  // window.Game = Game;
  // window.shared = shared;
  // window.DE = DE;
  
  return Game;
} );