/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* imagesList
this is the imagesList will be available in the project.
Please declare in the same way than this example.
To load image as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var datas = {
    // avalaible images sizes (engine will load optimisest images depends on user resolution)
    screenSizes: [
      { "w": 1280, "h": 720, "path": "" }
      // ,{ "w": 1280, "h": 720, "path": "", "notRatio": true }
      // , { "w": 640, "h": 360, "path": "", "notRatio": true }
      // , { "w": 480, "h": 270, "path": "sd/" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , baseUrl: "img/"
    
    // usage name, real name (can contain subpath), extension, parameters
    , pools: {
      main: [
          [ "bg", "bg.png", { "totalFrame": 1, "totalLine": 1, "eachAnim": 0, "isAnimated": false } ]
         ,[ "human", "characters/human.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "human-norm", "characters/human-normal.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "wolf", "characters/monster-wolf.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "wolf-norm", "characters/monster-wolf-normal.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "girl", "characters/little-girl.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "girl-norm", "characters/little-girl-normal.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "soothsayer", "characters/soothsayer.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "soothsayer-norm", "characters/soothsayer-normal.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "ninja", "characters/ninja.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         ,[ "ninja-norm", "characters/ninja-normal.png", { "totalFrame": 3, "totalLine": 4, "eachAnim": 75, "isAnimated": false } ]
         
         ,[ "LD", "level-design.jpg", { "totalFrame": 1, "totalLine": 1, "eachAnim": 75, "isAnimated": false } ]
         ,[ "LD-norm", "level-design-normal.jpg", { "totalFrame": 1, "totalLine": 1, "eachAnim": 75, "isAnimated": false } ]
         
         // fxs
         ,[ "sword_attack", "fx-human.png", { "totalFrame": 3, "totalLine": 0, "eachAnim": 120, "isAnimated": true, isLoop: false } ]
         ,[ "wolf_attack", "fx-monster.png", { "totalFrame": 4, "totalLine": 0, "eachAnim": 60, "isAnimated": true, isLoop: false } ]
         ,[ "cloud_fx", "fx-cloud.png", { "totalFrame": 6, "totalLine": 0, "eachAnim": 50, "isAnimated": true, isLoop: false } ]
         ,[ "blood_fx", "fx-blood.png", { "totalFrame": 5, "totalLine": 0, "eachAnim": 100, "isAnimated": true, isLoop: false } ]
        // , "environment.json"
      ]
    }
  };
  
  CONFIG.debug.log( "imagesDatas loaded", 3 );
  return datas;
} );