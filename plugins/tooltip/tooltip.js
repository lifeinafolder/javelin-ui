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

    if(this.getTrigger !== 'manual'){
      this._listen();
    }

  },
  members: {
    _present:false,
    _listen:function(){
      JX.Stratcom.listen(['mouseover','focus','mouseout','blur'], 'jx-tooltip', JX.bind(this,function(e) {
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
    _show:function(){
      if(!this._present){
        var tooltip = JX.$N('span',{className:'jx-tooltip'});
        JX.DOM.appendContent(tooltip, this.getElement().getAttribute('title'));
        this.setTooltip(tooltip);
        document.body.appendChild(tooltip);
      }
      this._present = true;
    },
    _hide:function(){
      this._present = false;
      JX.DOM.remove(this.getTooltip());
    }
  },
  statics:{
    //positions: ['top','bottom', 'left', 'right'],
    trigger: ['hover','focus','manual']
  },
  properties: {
    placement:null,
    element:null,
    tooltip:null,
    trigger:null
  }
});
