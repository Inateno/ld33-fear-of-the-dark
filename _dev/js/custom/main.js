/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* @constructor
* main.js
- load all customs files
add your files here but don't remove DREAM_ENGINE

-- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles
**/
require.config( {
  baseUrl: "./js/"
  , paths: {
    'files-engine'    : 'files-engine'
    
    // DATAS
    ,'DE.imagesDatas' : 'datas/imagesDatas'
    ,'DE.inputsList'  : 'datas/inputsList'
    ,'DE.audiosList'  : 'datas/audiosList'
    ,'DE.dictionary'  : 'datas/dictionary'
    ,'DE.achievements': 'datas/achievements'
    
    ,'gameLoop'       : 'custom/gameLoop'
    ,'Game'           : 'custom/Game'
    
    ,'Network'        : 'custom/Network'
    
    ,'Character'        : 'custom/Character'
    ,'Human'            : 'custom/Human'
    ,'config'           : 'custom/config'
    ,'shared'           : 'custom/shared'
    
    ,'View'             : 'custom/View'
    ,'windowLogin'      : 'custom/windowLogin'
    ,'windowGame'       : 'custom/windowGame'
    ,'windowScores'     : 'custom/windowScores'
    ,'windowEnd'        : 'custom/windowEnd'
  }
  , urlArgs: 'bust=' + Date.now()
} );

// init here your game with your code by using the Engine (as DE)
require( [ 'files-engine', 'gameLoop', 'Game', 'DE.imagesDatas', 'DE.audiosList', 'DE.inputsList', 'DE.achievements', 'DE.dictionary' ],
function( files, gameLoop, Game, images, audios, inputs, achievements, dictionary )
{
  console.log( "My Custom loads - stress test" );
  var DE = DreamEngine;
  DE.init(
  {
    'customLoop': gameLoop, 'onReady': Game.init
    , 'onStart': Game.start
    , 'images': images, 'audios': audios
    , 'inputs': inputs, 'dictionary': dictionary
    , 'about': { 'gameName': "LD33", "namespace": "LD33", 'author': "LD33", 'gameVersion': "0.1" }
    , 'saveModel': {}, 'saveIgnoreVersion': true
    , 'achievements': achievements
    , 'ignoreNebula': true
  } );
  window.DREAM_E = DE;
} );