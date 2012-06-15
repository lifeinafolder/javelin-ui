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
  construct: function(selector, config){
    config = config || {};
    if (__DEV__) {
      if (!selector) {
        JX.$E(
          'new JX.Dropdown(<?>, ...): '+
          'a DOM \'selector\' is required for Dropdown to operate' );
      }
    }
    this.setElement(document.querySelector(selector));
    this.setAlign(config.align || 'left');

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

      this._dropdownMenu = JX.DOM.find(this.getElement(),'ul','dropdown-menu');
      this._dropdownHandle = JX.DOM.find(this.getElement(),'div','dropdown-handle');

      //Hide the dropdown
      JX.DOM.hide(this._dropdownMenu);
      //Add our classes for basic styles
      JX.DOM.alterClass(this.getElement(),'jx-dropdown',true);
      JX.DOM.alterClass(this._dropdownMenu,'jx-dropdown-menu',true);
      JX.DOM.alterClass(this._dropdownHandle,'jx-dropdown-handle',true);
      //Set its position
      this._setPos();
    },
    _setPos:function(){

      var pos = JX.Vector.getPos(this._dropdownHandle);
      var dim = JX.Vector.getDim(this._dropdownHandle);

      //find coordinates
      var cords = {
        x: 0,
        y: dim.y
      };

      switch(this.getAlign()){
        case 'left':
          JX.$V(cords.x,cords.y).setPos(this._dropdownMenu);
          break;
        case 'right':
          JX.$V(cords.x,cords.y).setPos(this._dropdownMenu,'right');
          break;
        default:
          JX.$E('\'align\' can only be one of ' + JX.Dropdown.align.toString());
      }
    },
    _show:function(){
      JX.DOM.show(this._dropdownMenu);
      this._present = true;
    },
    _hide:function(){
      JX.DOM.hide(this._dropdownMenu);
      this._present = false;
    }
  },
  statics:{
    align:['left','right']
  },
  properties: {
    element:null,
    align:null
  }
});
