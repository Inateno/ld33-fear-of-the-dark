/**
* THIS IS: a sample to show you how to work with require for your project and include DreamEngine (for require ofc)
*
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
write here the function launching the engine
**/

define( [ 'lights', 'gameLoop', 'Game', 'DE.imagesDatas', 'DE.audiosList', 'DE.inputsList', 'DE.achievements', 'DE.dictionary' ],
function( lights, gameLoop, Game, images, audios, inputs, achievements, dictionary )
{
  // make a function, will be called by engine
  function launch( DE )
  {
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
      , 'loader': { totalFrame: 1, url: "bg.png", scale: 1.25 }
    } );
  }
  
  return launch;
} );