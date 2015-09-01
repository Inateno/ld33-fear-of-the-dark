define( [],
function()
{
  var local = 0;
  var config = {
    server_port: 666 // port client use to connect
    
    , SESSIONS: {
      MAX_AGE: 24*60*60*1000*7 // a week
      ,SESSION_SECRET: "LD33-js-ftw"
      ,COOKIE_NAME: "ld33-sid-yay"
    }
    
    , reservedWords: [ "server", "admin" ]
    
    // in game settings
    , spawns: [
      { x: -1196, y: 1177}
      ,{ x: 1174, y: -1027}
      ,{ x: 1130, y: 1166}
      ,{ x: -1131, y: -1144}
      ,{ x: -1006, y: 1053}
      ,{ x: -1001, y: -1029}
      ,{ x: 1009, y: -1136}
      ,{ x: 981, y: 1003}
    ]
    
    ,attackRange: 100
    ,classes: {
      human: {
        speed     : 4
        ,radius   : 30
        ,startPos : { x: 640, y: 360 }
        ,delayBetweenAction : 3000
        ,sprites  : [ "human", "soothsayer", "girl", "ninja" ]
      }
      , monster_wolf: {
        speed     : 5
        ,radius   : 30
        ,startPos : { x: 640, y: 360 }
        ,delayBetweenAction : 2000
        ,sprites  : [ "human", "soothsayer", "girl", "ninja" ]
        ,monsterSprite   : "wolf"
      }
      , soothsayer: {
        speed     : 4
        ,radius   : 30
        ,startPos : { x: 640, y: 360 }
        ,delayBetweenAction : 3000
        ,sprites  : [ "soothsayer" ]
      }
    }
    , monsters: [ 1, 5, 7 ]
    , classes_name: [ "human", "monster_wolf", "soothsayer" ]
    , PLAYABLE_CLASSES: {
      HUMAN       : 0
      ,WOLF       : 1
      ,SOOTHSAYER : 2
      ,LITTLE_GIRL: 3
      ,NINJA      : 4
      ,TROLL      : 5
      ,POTATO     : 6
      ,WHEEPING_ANGEL: 7
    }
  };
  
  return config;
} );