define( [ 'DREAM_ENGINE', 'Network', 'shared', 'config', 'View' ],
function( DE, Network, shared, config, View )
{
  var view = new View( "game" );
  view.card = document.getElementById( "card" );
  view.objective = document.getElementById( "objective" );
  view.globScore = document.getElementById( "global-score" );
  view.globHumans = document.getElementById( "glob-humans" );
  view.globMonsters = document.getElementById( "glob-monsters" );
  
  var _objectives = {
    "human": "You are being hunted by monsters, run away and save your life !"
    ,"monster_wolf": "You are the monster ! Kill the other in the shadow"
    ,"soothsayer": "You are the soothsayer you can see horrible thing that'll save you !"
    ,"little_girl": "You are a little girl lost in a dark place, find help"
  }
  var _firstPlay = true;
  DE.on( "show-my-card", function()
  {
    document.getElementById( "logo" ).style.display = "none";
    view.show();
    view.el.className += " show_objective";
    view.globScore.style.display = "none";
    view.card.src = "img/cards/" + config.classes_name[ shared.players[ shared.myIndex ].type ] + ".png";
    
    view.objective.innerHTML = _objectives[ config.classes_name[ shared.players[ shared.myIndex ].type ] ];
    
    setTimeout( function()
    {
      view.el.className = view.el.className.replace( " show_objective", "" );
      if ( _firstPlay )
        DE.trigger( "start-play" );
      _firstPlay = false;
      view.globScore.style.display = "block";
    }, 3500 );
  } );
  
  Network.listen( "glob-score-humans", function( val )
  {
    view.globHumans.innerHTML = val;
  } );
  Network.listen( "glob-score-monsters", function( val )
  {
    view.globMonsters.innerHTML = val;
  } );
  
  return view;
} );