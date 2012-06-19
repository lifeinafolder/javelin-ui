/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Tooltip Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Tooltip', {
  construct: function(node, config){
    config = config || {};
    if (__DEV__) {
      if (!node) {
        JX.$E(
          'new JX.Tooltip(<?>, ...): '+
          'A DOM \'node\' is required to create a tooltip');
      }
    }

    //JX.Stratcom.addSigil(element,'jx-tooltip')
    this.setElement(node);
    this.setTrigger(config.trigger);
    this.setPosition(config.position);
  },
  members: {
    _present:false,
    _title:null,
    _tooltip:null,
    _setPos:function(){
        var position = this.getPosition() || 'top';
        var tooltip = this._tooltip;

        var pos = JX.Vector.getPos(this.getElement());
        var dim = JX.Vector.getDim(this.getElement());

        //find center coordinates
        var cords = {
          x: pos.x + (dim.x/2) - (JX.Vector.getDim(tooltip).x/2),
          y: pos.y + (dim.y/2) - (JX.Vector.getDim(tooltip).y/2)
        };

        switch(position){
          case 'top':
            cords.y = pos.y - (JX.Vector.getDim(tooltip).y);
            break;
          case 'bottom':
            cords.y = pos.y + dim.y;
            break;
          case 'left':
            cords.x = pos.x - (JX.Vector.getDim(tooltip).x);
            break;
          case 'right':
            cords.x = pos.x + dim.x;
            break;
          default:
            JX.$E('\'position\' can only be one of ' + JX.Tooltip.positions.toString());
        }
        JX.$V(cords.x,cords.y).setPos(this._tooltip);
    },
    show:function(){
      if(!this._present){
        this._tooltip = JX.$N('span',{className:'jx-tooltip'});
        this._title = this.getElement().dataset['tooltip'];
        JX.DOM.appendContent(this._tooltip, this._title);
        document.body.appendChild(this._tooltip);
        this._setPos();//position the tooltip correctly
      }
      this._present = true;
    },
    hide:function(){
      this._present = false;
      JX.DOM.remove(this._tooltip);
    }
  },
  statics:{
    positions: ['top','bottom', 'left', 'right'],
    trigger: ['hover','focus','manual'] //TODO: For future validation purposes
  },
  properties: {
    element:null,
    trigger:null,
    position:null,
  }
});

JX.behavior('show-tooltip', function(config, statics) {
  var map = {};
  JX.Stratcom.listen(['mouseover','focus','mouseout','blur'], 'tooltip', JX.bind(this,function(e){
    var data = e.getNodeData('tooltip');
    var node = e.getTarget();
    var obj;
    if (map[data._cacheId]) {
      //console.log('cached');
      obj = map[data._cacheId];
    }
    else {
      //console.log('not cached');
      var obj = new JX.Tooltip(node, data);

      //Cache it
      JX.Stratcom.addData(node,{
        '_cacheId' : obj.__id__
      });
      map[obj.__id__] = obj;

      //console.log(b.getTrigger(),e.getType());
    }

    if (!obj.getTrigger() ||
        (obj.getTrigger() === 'hover' && e.getType() === 'mouseover') ||
        (obj.getTrigger() === 'focus' && e.getType() === 'focus')
      ){
      obj.show();
    }

    if (!obj.getTrigger() ||
        (obj.getTrigger() === 'hover' && e.getType() === 'mouseout') ||
        (obj.getTrigger() === 'focus' && e.getType() === 'blur')
      ){
      obj.hide();
    }
  }));
});