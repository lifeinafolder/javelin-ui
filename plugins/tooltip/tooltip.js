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

    JX.Memoize.call(this);
  },
  members: {
    present:false,
    title:null,
    tooltip:null,
    setPos:function(){
        var position = this.getPosition() || 'top';
        var tooltip = this.tooltip;

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
        JX.$V(cords.x,cords.y).setPos(this.tooltip);
    },
    show:function(){
      if(!this.present){
        this.tooltip = JX.$N('span',{className:'jx-tooltip'});
        this.title = this.getElement().dataset['tooltip'];
        JX.DOM.appendContent(this.tooltip, this.title);
        document.body.appendChild(this.tooltip);
        this.setPos();//position the tooltip correctly
      }
      this.present = true;
    },
    hide:function(){
      this.present = false;
      JX.DOM.remove(this.tooltip);
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
  },
  extend:'Memoize'
});

JX.behavior('show-tooltip', function(config, statics) {
  var map = {};
  JX.Stratcom.listen(['mouseover','focus','mouseout','blur'], 'tooltip', JX.bind(this,function(e){
    var data = e.getNodeData('tooltip');
    var node = e.getTarget();

    var cachedObj = JX.Memoize.find(data._cacheId);

    if (cachedObj) {
      //console.log('cached');
      var obj = cachedObj;
    }
    else {
      //console.log('not cached');
      var obj = new JX.Tooltip(node, data);
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