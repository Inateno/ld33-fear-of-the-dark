// method used to respawn a player
// if he die he can get any class but if he don't (win as a non-monster) he preserve current class to increase score
define( [ 'config', 'shared' ],
function( config, shared )
{
  function respawn( socket, preventEmit )
  {
    if ( !socket.player.is_dead )
      return;
    
    var spawn = config.spawns[ Math.random() * config.spawns.length >> 0 ];
    socket.player.position = { x: spawn.x, y: spawn.y };
    socket.player.is_dead = false;
    socket.player.last_score = socket.player.score;
    socket.player.score = 0;
    socket.player.lastAction = Date.now();
    
    // TODO : choose a random classes, for monsters check there is not to much monsters in the game already
    // socket.player.type = config.PLAYABLE_CLASSES.HUMAN;
    var types = {};
    for ( var t in config.PLAYABLE_CLASSES )
      types[ config.PLAYABLE_CLASSES[ t ] ] = 0;
    
    for ( var i in shared.players )
    {
      if ( shared.players[ i ].is_dead || i == socket.myIndex )
        continue;
      ++types[ shared.players[ i ].type ];
    }
    // console.log( "types:" );
    // console.log( types )
    // console.log( "----- end -----" );
    var selectedType = 0;
    // basic requirements
    if ( types[ config.PLAYABLE_CLASSES.HUMAN ] <= types[ config.PLAYABLE_CLASSES.WOLF ] )
      selectedType = config.PLAYABLE_CLASSES.HUMAN;
    else if (  types[ config.PLAYABLE_CLASSES.WOLF ] < types[ config.PLAYABLE_CLASSES.HUMAN ] )
      selectedType = config.PLAYABLE_CLASSES.WOLF;
    else
    {
      // more wolf than human
      if ( types[ config.PLAYABLE_CLASSES.WOLF ] >= types[ config.PLAYABLE_CLASSES.HUMAN ] )
        selectedType = config.PLAYABLE_CLASSES.HUMAN;
      // twice more human than wolf
      else if ( types[ config.PLAYABLE_CLASSES.HUMAN ] > types[ config.PLAYABLE_CLASSES.WOLF ] * 2 )
        selectedType = config.PLAYABLE_CLASSES.WOLF;
      // random yeah
      else
      {
        if ( Math.random() * 2 > 1 )
          selectedType = config.PLAYABLE_CLASSES.WOLF;
        else
          selectedType = config.PLAYABLE_CLASSES.HUMAN;
      }
    }
    
    socket.player.type = selectedType;
    console.log( "selectedType: " + selectedType )
    var classData = config.classes[ config.classes_name[ socket.player.type ] ];
    socket.player.sprite = classData.sprites[ Math.random() * classData.sprites.length >> 0 ];
    socket.player.monsterSprite = classData.monsterSprite;
    socket.player.delayBetweenAction = classData.delayBetweenAction;
    
    if ( preventEmit )
      return;
    
    socket.emit( "respawn", socket.player );
    socket.to( socket.room ).emit( "player-respawn", socket.myIndex, socket.player );
  }
  
  return respawn;
} );