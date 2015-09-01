define( [ 'winston' ]
,function( winston )
{
  // Set up logger
  var customColors = {
    trace: 'white',
    stats: 'grey',
    debug: 'green',
    info: 'cyan',
    warn: 'yellow',
    crit: 'orange',
    fatal: 'red'
  };
  
  var logger = null;
  var init = function()
  {
    if ( arguments.length == 1 && null == logger )
    {
      logger = new(winston.Logger)({
        colors: customColors,
        levels: {
          trace: 0,
          stats: 0,
          debug: 1,
          info: 2,
          warn: 3,
          crit: 4,
          fatal: 5
        },
        transports: [
        new (winston.transports.File)({ filename: 'server.log', level: "trace" })
        ,new(winston.transports.Console)({
          level: "trace",
          colorize: true,
          timestamp: true
        })
        ]
      });
       
      winston.addColors(customColors);
      
      // Extend logger object to properly log 'Error' types
      var origLog = logger.log;
       
      logger.log = function (level, msg)
      {
        var objType = Object.prototype.toString.call(msg);
        if (objType === '[object Error]') {
          origLog.call(logger, level, msg.toString());
        } else {
          origLog.call(logger, level, msg);
        }
      };
    }
    else
    {
      logger.log.apply( logger, arguments );
    }
  }
  return init;
} );