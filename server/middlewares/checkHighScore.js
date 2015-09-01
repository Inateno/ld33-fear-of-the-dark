define( [ 'config', 'shared', 'fs' ],
function( config, shared, fs )
{
  function checkHighScore( soc )
  {
    var haveToSend = false;
    var opl = soc.player;
    if ( opl.score > 0 && shared.highscores.length == 0 )
    {
      shared.highscores.push( createHighscoreEntry( opl ) );
      haveToSend = true;
    }
    else if ( opl.score > opl.highscore )
    {
      haveToSend = true;
      opl.highscore = opl.score;
      
      // remove a previous entry for this player
      for ( var e = 0; e < shared.highscores.length; ++e )
      {
        if ( shared.highscores[ e ].nick == opl.nick )
        {
          // delete old one only if new one is better
          if ( shared.highscores[ e ].score < opl.score )
            return;
          shared.highscores.splice( e, 1 );
          break;
        }
      }
      
      if ( shared.highscores.length == 0 )
      {
        shared.highscores.push( createHighscoreEntry( opl ) );
      }
      else
      {
        // now add score
        for ( var i = 0; i < shared.highscores.length; ++i )
        {
          if ( opl.score > shared.highscores[ i ].score )
          {
            shared.highscores.splice( i, 0, createHighscoreEntry( opl ) );
            break;
          }
          else if ( i + 1 == shared.highscores.length )
          {
            shared.highscores.push( createHighscoreEntry( opl ) );
            break;
          }
        }
      }
    }
    
    if ( haveToSend )
    {
      soc.emit( "scores-update", shared.highscores );
      soc.to( soc.room ).emit( "scores-update", shared.highscores );
      
      var outputFilename = 'SCORES.json';
      fs.writeFile( outputFilename, JSON.stringify( shared.highscores ), function( err )
      {
        if ( err ) {
          console.logger( "fatal", "Error on save global SCORES " + err );
        } else {
          console.log( "JSON saved to " + outputFilename );
        }
      } );
    }
  }
  
  function createHighscoreEntry( player )
  {
    return {
      nick    : player.nick
      ,country: player.country
      ,role   : player.type
      ,score  : player.score
    }
  }
  
  return checkHighScore;
} );