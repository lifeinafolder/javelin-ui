/**
 * @requires javelin-install javelin-dom javelin-stratcom javelin-toggle
 * @javelin
 */

/**
 * Dropdown Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Dropdown', {
  extend:'Toggle',
  construct: function(handle, config){
    config = config || {};

    var hook = document.querySelector(handle);
    this.setElement(hook);

    var box = JX.DOM.find(hook,'ul','dropdown-menu');
    var handle = JX.DOM.find(hook,'div','dropdown-handle');

    JX.Toggle.call(this, handle, box, config);

    this.start();

    JX.Stratcom.listen('click', null, JX.bind(this,function(e){
      var target = e.getTarget();
      switch (target.dataset['sigil']){
        case 'dropdown-handle':
          (this.present) ? this.hide() : this.show();
          break;
        case 'dropdown-item':
          this.invoke('click', JX.copy({},target.dataset));
          break;
        default:
          this.hide();
      }
    }));
  },
  events:['click'],
  members: {
    start:function(){
      //Hide the dropdown
      this.hide();

      //Add our classes for basic styles
      JX.DOM.alterClass(this.getElement(),'jx-dropdown',true);
      JX.DOM.alterClass(this.getBox(),'jx-dropdown-menu',true);
      JX.DOM.alterClass(this.getHandle(),'jx-dropdown-handle',true);

      //Set its position
      this.setPos();
    }
  },
  properties: {
    element:null
  }
});

JX.behavior('show-dropdown', function(config, statics) {
  var selector = config.selector;
  delete config.selector;
  var dropdown = new JX.Dropdown(selector, config);

  dropdown.listen('click',function(r){
    console.log(r);
  })
});