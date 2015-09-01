define( [],
function()
{
  function View( elId )
  {
    this.isVisible = false;
    this.el = document.getElementById( elId );
    
    this.onShow = function(){};
    this.onHide = function(){};
    
    this.toggleVisible = function()
    {
      this.el.style.display = this.isVisible ? "none" : "block";
      this.isVisible = !this.isVisible;
      
      if ( this.isVisible )
        this.onShow();
      else
        this.onHide();
    };
    this.show = function()
    {
      this.onShow();
      this.el.style.display = "block";
      this.isVisible = true;
    };
    this.hide = function()
    {
      this.onHide();
      this.el.style.display = "none";
      this.isVisible = false;
    }
  };
  
  return View;
} );