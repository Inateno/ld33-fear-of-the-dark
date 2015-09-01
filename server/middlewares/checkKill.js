// this file check if the player can really kill an other (about position detection)
define( [ 'config', 'shared', 'mid.checkHighScore', 'fs' ],
function( config, shared, checkHighScore, fs )
{
  function checkKill( soc, targetId, targetPosSent )
  {
    // if both are monsters, prevent attack
    if ( !targetId || !targetPosSent || soc.player.monsterSprite && shared.players[ targetId ].monsterSprite
      || !shared.players[ targetId ] || shared.players[ targetId ].is_dead )
      return;
    
    if ( Math.abs( targetPosSent.x - shared.players[ targetId ].position.x ) > 10
      || Math.abs( targetPosSent.y - shared.players[ targetId ].position.y ) > 10 )
      return;
    
    var mpos = soc.player.position;
    var opos = shared.players[ targetId ].position;
    
    var allowedDistance = config.attackRange * config.attackRange;
    var realDistance = ( ( opos.x - mpos.x ) * ( opos.x - mpos.x ) )
                     + ( ( opos.y - mpos.y ) * ( opos.y - mpos.y ) );
    
    if ( realDistance < allowedDistance )
    {
      // no monsters, a human kill an other human
      if ( !soc.player.monsterSprite && !shared.players[ targetId ].monsterSprite )
        --soc.player.score;
      else
        ++soc.player.score;
      
      if ( shared.players[ targetId ].monsterSprite )
      {
        soc.emit( "glob-score-monsters", ++shared.globalScore.monsters );
        soc.to( soc.room ).emit( "glob-score-monsters", shared.globalScore.monsters );
      }
      else
      {
        soc.emit( "glob-score-humans", ++shared.globalScore.humans );
        soc.to( soc.room ).emit( "glob-score-humans", shared.globalScore.humans );
      }
      
      shared.players[ targetId ].is_dead = true;
      soc.emit( "player-die", targetId, soc.player.score );
      soc.to( soc.room ).emit( "player-die", targetId );
      checkHighScore( soc );
      
      var outputFilename = 'KILLS.json';
      fs.writeFile( outputFilename, JSON.stringify( shared.globalScore ), function( err )
      {
        if ( err ) {
          console.logger( "fatal", "Error on save global KILLS " + err );
        } else {
          console.log( "JSON saved to " + outputFilename );
        }
      } );
    }
  };
  
  return checkKill;
} );