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
  construct: function(config){
    config = config || {};
    if (__DEV__) {
      if (!config.selector) {
        JX.$E(
          'new JX.Tooltip(<?>, ...): '+
          '\'selector\' is required to create a tooltip');
      }
    }

    var element = document.querySelector(config.selector);

    JX.Stratcom.addSigil(element,'jx-tooltip')
    this.setElement(element);
    this.setTrigger(config.trigger);
    this.setPosition(config.position);
    if(this.getTrigger !== 'manual'){
      this._listen();
    }

  },
  members: {
    _present:false,
    _listen:function(){
      JX.DOM.listen(this.getElement(),['mouseover','focus','mouseout','blur'], 'jx-tooltip', JX.bind(this,function(e) {
        //TODO: Boo! This is ugly.
        if (!this.getTrigger() || 
            (this.getTrigger() === 'hover' && e.getType() === 'mouseover') ||
            (this.getTrigger() === 'focus' && e.getType() === 'focus')
          ){
          this._show();
        }

        if (!this.getTrigger() ||
            (this.getTrigger() === 'hover' && e.getType() === 'mouseout') ||
            (this.getTrigger() === 'focus' && e.getType() === 'blur')
          ){
          this._hide();
        }
      }));
    },
    _setPos:function(){
        var position = this.getPosition() || 'top';
        var tooltip = this.getTooltip();

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
        JX.$V(cords.x,cords.y).setPos(this.getTooltip());
    },
    _show:function(){
      if(!this._present){
        var tooltip = JX.$N('span',{className:'jx-tooltip'});
        JX.DOM.appendContent(tooltip, this.getElement().getAttribute('data-tooltip'));
        this.setTooltip(tooltip);
        document.body.appendChild(tooltip);
        this._setPos();//position the tooltip correctly
      }
      this._present = true;
    },
    _hide:function(){
      this._present = false;
      JX.DOM.remove(this.getTooltip());
    }
  },
  statics:{
    positions: ['top','bottom', 'left', 'right'],
    trigger: ['hover','focus','manual'] //TODO: For future validation purposes
  },
  properties: {
    element:null,
    tooltip:null,
    trigger:null,
    position:null
  }
});
