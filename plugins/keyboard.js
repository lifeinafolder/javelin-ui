JX.Keyboard = {
  keys : {
    'ENTER': 13,
    'ESC'  : 27,
    'CTRL' : 17,
    'ALT'  : 18,
    'CAPS' : 20,
    'SHIFT': 16,
    'LEFT' : 37,
    'UP'   : 38,
    'RIGHT': 39,
    'DOWN' : 40
  },
  is : function(event, codes){
    codes = JX.$AX(codes);
    return (codes.indexOf(JX.Keyboard.keys[event.key]) > -1);
  },
  listen: function(sigil, cbk){
    sigil = sigil || null;
    JX.Stratcom.listen('keyup', sigil, function(e){
      var keyCode = e.getRawEvent().which;
      var supported = false;
      for (key in JX.Keyboard.keys){
        if (JX.Keyboard.keys[key] === keyCode){
          //Found
          cbk && cbk({
            'key' : key
          });
          supported = true;
          break;
        }
      }

      if (!supported){
        //JX.$E('Key not found in supported list:', Keyboard.keys.toString());
      }
    });
  }
};