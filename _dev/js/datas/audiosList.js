/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* audioList
this is the audioList will be available in the project.
Please declare in the same way than this example.
To load audio as default just set "preload" to true.
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var audioList = [
    // MUSICS
    [ "game_music", "audio/dark_is_my_friend", [ 'mp3', 'ogg' ], { "preload": true, "loop": true, "isMusic": true } ]
    
    // // FX
    // ,[ "achievement-unlocked", "audio/achievement-unlocked", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "human_attack", "audio/fx/human_attack", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "wolf_attack1", "audio/fx/wolf_attack1", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "wolf_attack2", "audio/fx/wolf_attack2", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "wolf_attack3", "audio/fx/wolf_attack3", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "human_die1", "audio/fx/human_die1", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "human_die2", "audio/fx/human_die2", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "wolf_die1", "audio/fx/wolf_die1", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "wolf_die2", "audio/fx/wolf_die2", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "candle_on", "audio/fx/candle_on", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "candle_off", "audio/fx/candle_off", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
  ];
  CONFIG.debug.log( "audioList loaded", 3 );
  return audioList;
} );