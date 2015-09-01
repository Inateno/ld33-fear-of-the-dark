define( [],
function()
{
  var shared = {
    "myIndex" : undefined
    ,"nick"   : undefined
    ,"players": {}
  };
  
  shared.nick = "player - " + shared.myIndex;
  return shared;
} );