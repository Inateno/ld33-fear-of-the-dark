define( [ 'DREAM_ENGINE', 'Network', 'View' ],
function( DE, Network, View )
{
  var view = new View( "end" );
  view.btnPlay = document.getElementById( "btnReplay" );
  view.endScore = document.getElementById( "endScore" );
  
  view.btnPlay.addEventListener( 'pointerup', function()
  {
    Network.send( "replay" );
  }, false );
  
  DE.on( "die", function( score )
  {
    view.endScore.innerHTML = score;
    view.show();
  } );
  
  DE.on( "show-my-card", function()
  {
    view.hide();
  } );
  
  return view;
} );