define( [], function()
{
  var config = {
    // app_url         : "http://ola-dev.dreamirl.com"
    app_url         : "http://localhost"
    ,app_port       : 666
    ,screenWidth    : 1280
    ,screenHeight   : 720
    ,timeBetweenHit : 150
    ,field: {
      width: 1280 * 4
      ,height: 720 * 3
    }
    
    ,attackRange: 100
    ,classes: {
      human: {
        speed              : 4
        ,radius            : 30
        ,startPos          : { x: 640, y: 360 }
        ,delayBetweenAction: 3000
        ,sprites           : [ "human", "soothsayer", "girl", "ninja" ]
        ,actionFxs         : [ "human_attack" ]
        ,deathFxs          : [ "human_die1", "human_die2" ]
      }
      , monster_wolf: {
        speed              : 5
        ,radius            : 30
        ,startPos          : { x: 640, y: 360 }
        ,delayBetweenAction: 2000
        ,sprites           : [ "human", "soothsayer", "girl", "ninja" ]
        ,monsterSprite     : "wolf"
        ,actionFxs         : [ "wolf_attack1", "wolf_attack2", "wolf_attack3" ]
        ,deathFxs          : [ "wolf_die1", "wolf_die2" ]
      }
      ,little_girl: {
        speed              : 3
        ,radius            : 30
        ,startPos          : { x: 640, y: 360 }
        ,delayBetweenAction: 15000
        ,sprites           : [ "little_girl" ]
        ,actionFxs         : []
        ,deathFxs          : [ "girly_death" ]
      }
    }
    , monsters: [ 1, 5, 7 ]
    , classes_name: [ "human", "monster_wolf", "soothsayer", "little_girl" ]
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