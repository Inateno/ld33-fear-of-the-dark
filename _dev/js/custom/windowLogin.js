define( [ 'DREAM_ENGINE', 'Network', 'View' ],
function( DE, Network, View )
{
  var view = new View( "login" );
  view.nick = document.getElementById( "nickname" );
  view.country = document.getElementById( "country" );
  view.btnPlay = document.getElementById( "btnPlay" );
  
  view.onShow = function()
  {
    DE.Inputs.keyLocked = true;
  };
  
  view.onHide = function()
  {
    DE.Inputs.keyLocked = false;
  };
  
  view.btnPlay.addEventListener( 'pointerup', function()
  {
    Network.send( "login", view.nick.value, view.country.value );
  }, false );
  
  Network.listen( "nick-not-available", function()
  {
    alert( "Nickname is not available, choose an other one" );
  } );
  
  DE.on( "show-my-card", function()
  {
    view.hide();
  } );
  
  return view;
} );