define( [ 'config' ],
function( config )
{
  // socket store sessionID, session too
  // session can access socket and player
  // socket can access player
  // player cannot access others
  var shared = {
    sessions       : {} // store session by sessionID
    ,playersSession: {} // store session by player nick
    ,players       : {} // store player by nick
    ,nConnections: 0
    ,nPlayers    : 0
    ,guestCounter: 0
    ,globalScore: {
      humans   : 0
      ,monsters: 0
    }
    
    ,level: [
      // center v
      { x: -200, y: -600, zindex: 0, component: "small-vbox" }
      ,{ x: 200, y: -600, zindex: 0, component: "small-vbox" }
      ,{ x: -200, y: 600, zindex: 0, component: "small-vbox" }
      ,{ x: 200, y: 600, zindex: 0, component: "small-vbox" }
      
      // fill
      ,{ x: 900, y: 450, zindex: 0, component: "vsmall-vbox" }
      ,{ x: -900, y: 450, zindex: 0, component: "vsmall-vbox" }
      ,{ x: -900, y: -450, zindex: 0, component: "vsmall-vbox" }
      ,{ x: 900, y: -450, zindex: 0, component: "vsmall-vbox" }
      
      // center h
      ,{ y: -200, x: -600, zindex: 0, component: "small-hbox" }
      ,{ y: 200, x: -600, zindex: 0, component: "small-hbox" }
      ,{ y: -200, x: 600, zindex: 0, component: "small-hbox" }
      ,{ y: 200, x: 600, zindex: 0, component: "small-hbox" }
      
      // room border
      ,{ y: -700, x: -600, zindex: 0, component: "small-hbox" }
      ,{ y: 700, x: -600, zindex: 0, component: "small-hbox" }
      ,{ y: -700, x: 600, zindex: 0, component: "small-hbox" }
      ,{ y: 700, x: 600, zindex: 0, component: "small-hbox" }
      
      // room extreme border
      ,{ y: -1500, x: -1100, zindex: 0, component: "small-hbox" }
      ,{ y: 1500, x: -1100, zindex: 0, component: "small-hbox" }
      ,{ y: -1500, x: 1100, zindex: 0, component: "small-hbox" }
      ,{ y: 1500, x: 1100, zindex: 0, component: "small-hbox" }
      
      ,{ x: -1500, y: -1100, zindex: 0, component: "small-vbox" }
      ,{ x: 1500, y: -1100, zindex: 0, component: "small-vbox" }
      ,{ x: -1500, y: 1100, zindex: 0, component: "small-vbox" }
      ,{ x: 1500, y: 1100, zindex: 0, component: "small-vbox" }
      
      // left & right max
      ,{ x: -1300, y: 0, zindex: 0, component: "large-vbox" }
      ,{ x: 1300, y: 0, zindex: 0, component: "large-vbox" }
      // top & bottom max
      ,{ y: -1300, x: 0, zindex: 0, component: "large-hbox" }
      ,{ y: 1300, x: 0, zindex: 0, component: "large-hbox" }
      ,{ x: -1092, y: -1101, component: "room-light"}
      ,{ x: 1092, y: -1101, component: "room-light"}
      ,{ x: 1092, y: 1101, component: "room-light"}
      ,{ x: -1092, y: 1101, component: "room-light"}
    ]
    
    ,components: {
      "small-vbox": { w: 200, h: 800 }
      ,"vsmall-vbox": { w: 200, h: 400 }
      ,"small-hbox": { w: 800, h: 200 }
      ,"large-vbox": { w: 200, h: 1600 }
      ,"large-hbox": { w: 1600, h: 200 }
      ,"room-light":{ r: 400, color: "0xFFC560", force: 4 }
      // "wall-left1"    : { w: 200, h: 200, x: 0, y: 0 }
      // ,"wall-left"    : { w: 200, h: 200, x: 0, y: 0 }
      // ,"wall-left2"    : { w: 100, h: 200, x: 0, y: 0 }
      // ,"wall-left3"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-right1"    : { w: 200, h: 200, x: 0, y: 0 }
      // ,"wall-right2"    : { w: 100, h: 200, x: 0, y: 0 }
      // ,"wall-right3"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-middle" : { w: 0, h: 0, x: 0, y: 0 }
      // ,"wall-top"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-top1"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-top2"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-top3"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-top4"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-top5"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-bottom1"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-bottom2"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"wall-bottom3"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-bottom4"    : { w: 100, h: 100, x: 0, y: 0 }
      // ,"wall-bottom5"    : { w: 200, h: 100, x: 0, y: 0 }
      // ,"light_small" : { r: 512, alpha: 0.55 }
    }
    
    // this is a way to do better but our level-programmer didn't get enough time to do this correctly so we used the "jam way" :)
    // ,level: [
    //   { x: -500, y: 0, zindex: 0, component: "Cross" }
      
    //   ,{ x: -100, y: 900, zindex: 0, component: "corridorH" }
    //   ,{ x: 2100, y: 900, zindex: 0, component: "corridorH" }
    //   ,{ x: -100, y: -1300, zindex: 0, component: "corridorH" }
    //   ,{ x: 2100, y: -1300, zindex: 0, component: "corridorH" }
    //   ,{ x: -2250, y: -1300, zindex: 0, component: "corridorH" }
    //   ,{ x: -2250, y: 900, zindex: 0, component: "corridorH" }
      
    //   ,{ x: -1500, y: 150, zindex: 0, component: "corridorV" }
    //   ,{ x: 650, y: 150, zindex: 0, component: "corridorV" }
    //   ,{ x: 650, y: -2050, zindex: 0, component: "corridorV" } 
    //   ,{ x: -1500, y: -2050, zindex: 0, component: "corridorV" } //en haut a gauche
    //   ,{ x: -1500, y: 2350, zindex: 0, component: "corridorV" } // en bas a gauche
    //   ,{ x: 650, y: 2350, zindex: 0, component: "corridorV" }  // gauche milieu
      
    //   ,{ x: 1900, y: 0, zindex: 0, component: "tLeft" }
    //   ,{ x: -2250, y: 0, zindex: 0, component: "tRight" }
    //   ,{ x: -250, y: 2200, zindex: 0, component: "tTop" }
    //   ,{ x: -250, y: -2050, zindex: 0, component: "tDown" }
      
    //   ,{ x: 1900, y: 2150, zindex: 0, component: "room" }
    //   ,{ x: 1900, y: -2150, zindex: 0, component: "room" }
    //   ,{ x: -2650, y: -2150, zindex: 0, component: "room" }
    //   ,{ x: -2650, y: 2150, zindex: 0, component: "room" }
    //   // ,{ x: -500, y: 0, zindex: 0, component: "room4" }
    //   // ,{ x: -500, y: 0, zindex: 0, component: "tLeft" }
    //   // ,{ x: -500, y: 0, zindex: 0, component: "tTop" }
    //   // ,{ x: -500, y: 0, zindex: 0, component: "tDown" }
    // ]
    
    // ,level_components: {
    //   tRight: [
    //       {x:0, y:0, type:"wall-left1"},  
    //       {x:0, y:200, type:"wall-left1"},
    //       {x:0, y:500, type:"wall-left1"},
    //       {x:0, y:700, type:"wall-left1"},
    //       {x:400, y:0, type:"wall-right1"},  
    //       {x:400, y:700, type:"wall-right1"},
          
    //       {x:0, y:350, type:"wall-left2"},
    //       {x:400, y:150, type:"wall-middle"},
    //       {x:400, y:550, type:"wall-middle"},
          
    //       {x:550, y:150, type:"wall-top2"},
    //       {x:550, y:550, type:"wall-bottom2"}
    //   ],
    //   tLeft: [
    //       {x:600, y:0, type:"wall-right1"},  
    //       {x:600, y:200, type:"wall-right1"},
    //       {x:600, y:500, type:"wall-right1"},
    //       {x:600, y:700, type:"wall-right1"},
    //       {x:200, y:700, type:"wall-left1"},  
    //       {x:200, y:0, type:"wall-left1"},  
          
          
    //       {x:600, y:350, type:"wall-right1"},
    //       {x:200, y:150, type:"wall-middle"},
    //       {x:200, y:550, type:"wall-middle"},
          
    //       {x:50, y:150, type:"wall-top2"},
    //       {x:50, y:550, type:"wall-bottom2"}
    //   ],
    //   tTop: [
    //       {x:150, y:150, type:"wall-middle"},
    //       {x:550, y:150, type:"wall-middle"},
    //       {y:550, x:350, type:"wall-bottom4"},
          
    //       {x:0,   y:150, type:"wall-top2"},
    //       {y:550, x:0, type:"wall-bottom2"},  
    //       {y:550, x:200, type:"wall-bottom2"},
    //       {y:550, x:500, type:"wall-bottom2"},
    //       {y:550, x:700, type:"wall-bottom2"},
    //       {x:700, y:150, type:"wall-top2"},
          
    //       {x:150, y:0, type:"wall-left1"},  
    //       {x:550, y:0, type:"wall-right1"}
    //   ],
    //   tDown: [
    //       {x:150, y:550, type:"wall-left"},
    //       {x:0, y:400, type:"wall-bottom2"},
    //       {x:150, y:400, type:"wall-middle"},
          
    //       {x:0, y:0, type:"wall-top2"},  
    //       {x:200, y:0, type:"wall-top2"},
    //       {x:350, y:0, type:"wall-top4"},
    //       {x:500, y:0, type:"wall-top2"},
    //       {x:700, y:0,  type:"wall-top2"},
          
    //       {x:550, y:550, type:"wall-right1"},
    //       {x:550, y:400, type:"wall-middle"},
    //       {x:700, y:400, type:"wall-bottom2"}
    //   ],
    //   Cross: [
    //       {x:400, y:0, type:"wall-left1"},
    //       {x:450, y:200, type:"wall-bottom5"},
    //       {x:250, y:150, type:"wall-top2"},
          
    //       {x:400, y:700, type:"wall-left1"},
    //       {x:450, y:500, type:"wall-top5"},
    //       {x:250, y:550, type:"wall-bottom2"},
          
    //       {x:800, y:0, type:"wall-right1"},
    //       {x:750, y:200, type:"wall-bottom1"},
    //       {x:950, y:150, type:"wall-top2"},
          
    //       {x:800, y:700, type:"wall-right1"},
    //       {x:750, y:500, type:"wall-top1"},
    //       {x:950, y:550, type:"wall-bottom2"}
    //   ],
    //   corridorV: [
    //       {x:0, y:0, type:"wall-top2"},  
    //       {x:200, y:0, type:"wall-top2"},
    //       {x:400, y:0, type:"wall-top2"},
    //       {x:550, y:0, type:"wall-top4"},
    //       {x:700, y:0, type:"wall-top2"},
    //       {x:900, y:0, type:"wall-top2"},
    //       {x:1100, y:0, type:"wall-top2"},
          
    //       {x:0, y:400, type:"wall-bottom2"},  
    //       {x:200, y:400, type:"wall-bottom2"},
    //       {x:400, y:400, type:"wall-bottom2"},
    //       {x:550, y:400, type:"wall-bottom4"},
    //       {x:700, y:400, type:"wall-bottom2"},
    //       {x:900, y:400, type:"wall-bottom2"},
    //       {x:1100, y:400, type:"wall-bottom2"}
    //   ],
    //   corridorH: [
    //       {x:0, y:0, type:"wall-left1"},  
    //       {x:0, y:200, type:"wall-left1"},
    //       {x:0, y:400, type:"wall-left1"},
    //       {x:0, y:550, type:"wall-left2"},
    //       {x:0, y:700, type:"wall-left1"},
    //       {x:0, y:900, type:"wall-left1"},
    //       {x:0, y:1100, type:"wall-left1"},
          
    //       {x:400, y:0, type:"wall-right1"},  
    //       {x:400, y:200, type:"wall-right1"},
    //       {x:400, y:400, type:"wall-right1"},
    //       {x:400, y:550, type:"wall-right2"},
    //       {x:400, y:700, type:"wall-right1"},
    //       {x:400, y:900, type:"wall-right1"},
    //       {x:400, y:1100, type:"wall-right1"}
    //   ],
    //   room: [
    //       {x:0, y:0, type:"wall-top1"},  
    //       {x:200, y:0, type:"wall-top2"},
    //       {x:350, y:0, type:"wall-top4"},
    //       {x:450, y:0, type:"wall-top3"},
    //       {x:600, y:0, type:"wall-top2"},
    //       {x:800, y:0, type:"wall-top2"},
    //       {x:1000, y:0, type:"wall-top5"},
          
    //       {x:0, y:200, type:"wall-left1"},
    //       {x:0, y:350, type:"wall-left3"},
    //       {x:0, y:500, type:"wall-left1"},
          
    //       {x:0, y:700, type:"wall-bottom1"},  
    //       {x:200, y:700, type:"wall-bottom2"},
    //       {x:350, y:700, type:"wall-bottom4"},
    //       {x:450, y:700, type:"wall-bottom3"},
    //       {x:600, y:700, type:"wall-bottom2"},
    //       {x:800, y:700, type:"wall-bottom2"},
    //       {x:1000, y:700, type:"wall-bottom5"},
          
    //       {x:1000, y:200, type:"wall-right1"},
    //       {x:1000, y:350, type:"wall-right3"},
    //       {x:1000, y:500, type:"wall-right1"},
          
    //       {x:150, y:150, type:"wall-middle"},
    //       {x:250, y:150, type:"wall-middle"},
    //       {x:350, y:150, type:"wall-middle"},
    //       {x:450, y:150, type:"wall-middle"},
    //       {x:550, y:150, type:"wall-middle"},
    //       {x:650, y:150, type:"wall-middle"},
    //       {x:750, y:150, type:"wall-middle"},
    //       {x:850, y:150, type:"wall-middle"},
          
    //       {x:150, y:250, type:"wall-middle"},
    //       {x:250, y:250, type:"wall-middle"},
    //       {x:350, y:250, type:"wall-middle"},
    //       {x:450, y:250, type:"wall-middle"},
    //       {x:550, y:250, type:"wall-middle"},
    //       {x:650, y:250, type:"wall-middle"},
    //       {x:750, y:250, type:"wall-middle"},
    //       {x:850, y:250, type:"wall-middle"},
          
    //       {x:150, y:350, type:"wall-middle"},
    //       {x:250, y:350, type:"wall-middle"},
    //       {x:350, y:350, type:"wall-middle"},
    //       {x:450, y:350, type:"wall-middle"},
    //       {x:550, y:350, type:"wall-middle"},
    //       {x:650, y:350, type:"wall-middle"},
    //       {x:750, y:350, type:"wall-middle"},
    //       {x:850, y:350, type:"wall-middle"},
          
    //       {x:150, y:450, type:"wall-middle"},
    //       {x:250, y:450, type:"wall-middle"},
    //       {x:350, y:450, type:"wall-middle"},
    //       {x:450, y:450, type:"wall-middle"},
    //       {x:550, y:450, type:"wall-middle"},
    //       {x:650, y:450, type:"wall-middle"},
    //       {x:750, y:450, type:"wall-middle"},
    //       {x:850, y:450, type:"wall-middle"},
          
    //       {x:150, y:550, type:"wall-middle"},
    //       {x:250, y:550, type:"wall-middle"},
    //       {x:350, y:550, type:"wall-middle"},
    //       {x:450, y:550, type:"wall-middle"},
    //       {x:550, y:550, type:"wall-middle"},
    //       {x:650, y:550, type:"wall-middle"},
    //       {x:750, y:550, type:"wall-middle"},
    //       {x:850, y:550, type:"wall-middle"}
          
    //   ]
    // }
    
    ,classes   : []
    ,highscores: []
  };
  
  return shared;
} );