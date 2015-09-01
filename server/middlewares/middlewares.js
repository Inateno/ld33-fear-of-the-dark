define( [ 'mid.tchat', 'mid.checkPlayerLimits', 'mid.respawn', 'mid.checkHighScore', 'mid.checkKill' ],
function( tchat, checkPlayerLimits, respawn, checkHighScore, checkKill )
{
  var mids = {
    'tchat'              : tchat
    ,'checkPlayerLimits' : checkPlayerLimits
    ,'respawn'           : respawn
    ,'checkHighScore'    : checkHighScore
    ,'checkKill'         : checkKill
  };
  
  return mids;
} );