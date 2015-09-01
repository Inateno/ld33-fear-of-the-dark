define( [ 'DREAM_ENGINE', 'Network', 'View', 'config', 'shared' ],
function( DE, Network, View, config, shared )
{
  var view = new View( "scores" );
  view.list = document.getElementById( "score-list" );
  
  Network.listen( "scores-update", update );
  DE.on( "scores-update", update );
  
  function update( scores )
  {
    shared.scores = scores;
    
    view.list.innerHTML = null;
    for ( var i = 0; i < 5 && i < shared.scores.length; ++i )
    {
      view.list.innerHTML += "<div class='score-entry'><img src='img/cards/" + config.classes_name[ shared.scores[ i ].role ] + ".png' />"
        + shared.scores[ i ].nick + /*"(" + shared.scores[ i ].country + ")*/" " + shared.scores[ i ].score + "</div>";
    }
  }
  
  return view;
} );