define( [ 'Network', 'shared', 'DREAM_ENGINE' ],
function( Network, shared, DE )
{
  var tchat = new function()
  {
    var _self = this;
    
    this.element      = null;
    this.msgsElement  = null;
    this.inputElement = null;
    
    this.focusOpacity = 1;
    this.blurOpacity = 0.4;
    
    this.inited = false;
    this.init = function()
    {
      if ( this.inited )
        return;
      
      this.inited  = true;
      this.element = document.getElementById( "tchat" );
      this.msgsElement = this.element.getElementsByClassName( "messages" )[ 0 ];
      this.inputElement = this.element.getElementsByTagName( "INPUT" )[ 0 ];
      
      Network.listen( "tchat", this.add, this );
      Network.listen( "tchat-whisper", this.whisper, this );
      Network.listen( "tchat-command", this.command, this );
      Network.listen( "tchat-whisper-fail", this.error, this );
      Network.listen( "player-loaded", this.show, this );
      
      DE.Inputs.on( "keyDown", "tchat-open", function()
      {
        if ( _self.element.style.display == "none" )
          return;
        _self.focus();
      } );
      
      this.inputElement.addEventListener( "pointerdown", function()
      {
        _self.focus();
      }, false );
      this.inputElement.onblur = function()
      {
        _self.blur();
      };
      this.inputElement.addEventListener( "keydown", function( event )
      {
        var e = event || window.event;
        var code = e.which || e.keyCode;
        if ( code == 13 ) //si ENTER
        {
          if ( this.value.trim() !== "" )
            Network.send( "tchat", this.value );
          this.value = "";
          _self.blur();
        }
      }, false );
    };
    
    this.add = function( pid, msg )
    {
      this.msgsElement.innerHTML += "<div>" + shared.players[ pid ].nick + ": " + msg + "</div>";
      this.msgsElement.scrollTop = this.msgsElement.scrollHeight + 500;
    };
    this.whisper = function( id, msg, mine )
    {
      if ( mine )
        this.msgsElement.innerHTML += "<div style='color:purple'>[" + shared.players[ id ].nick + "]: " + msg + "</div>";
      else
        this.msgsElement.innerHTML += "<div style='color:purple'>[" + shared.players[ id ].nick + "]: " + msg + "</div>";
      this.msgsElement.scrollTop = this.msgsElement.scrollHeight + 500;
    };
    this.error = function( msg )
    {
      this.msgsElement.innerHTML += "<div style='color:red; font-weight: bold'>" + msg + "</div>";
      this.msgsElement.scrollTop = this.msgsElement.scrollHeight + 500;
    };
    this.command = function( msg )
    {
      this.msgsElement.innerHTML += "<div>" + msg.replace(/%br%/g, "<br/>") + "</div>";
      this.msgsElement.scrollTop = this.msgsElement.scrollHeight + 500;
    };
    
    this.clear = function()
    {
      this.msgsElement.innerHTML = "";
    };
    
    this.focus = function()
    {
      DE.Inputs.keyLocked = true;
      this.inputElement.focus();
      // this.element.style.opacity = this.focusOpacity;
    };
    this.blur = function()
    {
      DE.Inputs.keyLocked = false;
      this.inputElement.blur();
      // this.element.style.opacity = this.blurOpacity;
    };
    
    this.toggleGhostMode = function( show )
    {
      if ( show )
      {
        this.element.style.opacity = "1";
      }
      else
      {
        this.element.style.opacity = "0.1";
      }
    }
    
    this.show = function()
    {
      console.log( "tchat show " )
      this.element.style.display = "block";
    };
    this.hide = function()
    {
      this.element.style.display = "none";
    };
    
  };
  
  return tchat;
} );