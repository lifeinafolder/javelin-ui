/**
 * @requires javelin-install javelin-dom javelin-vector
 * @javelin
 */

/**
 * Toggle Plugin
 *
 * @group Plugin
 */
JX.install('Toggle', {
  construct: function(handle, box, config){
    config = config || {};
    if (__DEV__) {
      if (!handle) {
        JX.$E(
          'new JX.Toggle(<?>, ...): '+
          'a DOM \'handle\' is required for Toggle to operate' );
      }
    }
    this.setHandle(handle);
    this.setBox(box);
    this.setAlign(config.align || 'left');
  },
  events:['hide','show'],
  members: {
    present:false,
    setPos:function(){
      var pos = JX.Vector.getPos(this.getHandle());
      var dim = JX.Vector.getDim(this.getHandle());

      //find coordinates
      var cords = {
        x: 0,
        y: dim.y
      };

      switch(this.getAlign()){
        case 'left':
          JX.$V(cords.x,cords.y).setPos(this.getBox());
          break;
        case 'right':
          JX.$V(cords.x,cords.y).setPos(this.getBox(),'right');
          break;
        default:
          JX.$E('\'align\' can only be one of ' + JX.Toggle.align.toString());
      }
    },
    show:function(){
      JX.DOM.show(this.getBox());
      this.present = true;
      this.invoke('show');
    },
    hide:function(){
      JX.DOM.hide(this.getBox());
      this.present = false;
      this.invoke('hide');
    }
  },
  statics:{
    align:['left','right']
  },
  properties: {
    handle:null,
    align:null,
    box:null
  }
});