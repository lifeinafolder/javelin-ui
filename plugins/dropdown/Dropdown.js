/**
 * @requires javelin-install javelin-dom javelin-vector
 * @javelin
 */

/**
 * Dropdown Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Dropdown', {
  construct: function(config){
    config = config || {};
    if (__DEV__) {
      if (!config.selector || !config.handle) {
        JX.$E(
          'new JX.Dropdown(<?>, ...): '+
          'a DOM \'selector\' & \'handle\' is required for Dropdown to operate' );
      }
    }
    this.setHandle(document.querySelector(config.handle));
    this.setElement(document.querySelector(config.selector));
    this._start();
    JX.Stratcom.listen('click',null,JX.bind(this,function(e){
      var target = e.getTarget();
      if (JX.Stratcom.hasSigil(target, 'dropdown-handle')){
        (this._present) ? this._hide() : this._show();
        return;
      }

      if (!JX.Stratcom.hasSigil(target, 'dropdown-menu') && !JX.Stratcom.hasSigil(target, 'dropdown-item')){
        this._hide();
      }
    }));
  },
  members: {
    _present:false,
    _start:function(){
      //Hide the dropdown
      JX.DOM.hide(this.getElement());
      //Add our classes for basic styles
      JX.DOM.alterClass(this.getElement(),'jx-dropdown',true);
      JX.DOM.alterClass(this.getHandle(),'jx-dropdown-handle',true);
      //Set its position
      this._setPos();
    },
    _setPos:function(){
      var dropdown = this.getElement();

      var pos = JX.Vector.getPos(this.getHandle());
      var dim = JX.Vector.getDim(this.getHandle());

      //find coordinates
      var cords = {
        x: pos.x,
        y: pos.y + dim.y
      };

      JX.$V(cords.x,cords.y).setPos(this.getElement());
    },
    _show:function(){
      JX.DOM.show(this.getElement());
      this._present = true;
    },
    _hide:function(){
      JX.DOM.hide(this.getElement());
      this._present = false;
    }
  },
  statics:{
    align:['left','right']
  },
  properties: {
    handle:null,
    element:null
  }
});
