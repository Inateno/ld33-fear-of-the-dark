/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* @inputsList
this is the inputsList will be available in the project.
Please declare in the same way than this example.
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var inputsList = {
  	"0-left":{"keycodes":[ "K.left" ] }
    ,"0-right":{"keycodes":[ "K.right" ] }
    ,"0-up":{"keycodes":[ "K.up" ] }
    ,"0-down":{"keycodes":[ "K.down" ] }
    ,"0-action":{"keycodes":[ "K.space", "G0.B.A" ] }
    ,"0-candle":{"keycodes":[ "K.x", "G0.B.B" ] }
    
    ,"0-haxe":{"keycodes": [ "G0.A.LHorizontal" ] }
    ,"0-vaxe":{"keycodes": [ "G0.A.LVertical" ] }
    ,"tchat-open":{"keycodes": [ "K.enter" ] }
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );