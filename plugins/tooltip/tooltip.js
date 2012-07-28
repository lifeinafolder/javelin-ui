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
  construct: function(node, config) {
    config = config || {};
    if (__DEV__) {
      if (!node) {
        JX.$E(
          'new JX.Tooltip(<?>, ...): '+
          'A DOM \'node\' is required to create a tooltip');
      }
    }

    this.setElement(node);
    if (config.title) {
      try {
        this.setTitle(document.querySelector(config.title));
      }
      catch (e) {
        JX.$E('\'title\' property needs to be a DOM selector');
        return;
      }
    }
    else { // try to pick from the 'title' attribute
      var titleAttribute = this.getElement().getAttribute('title');
      if (titleAttribute) {
        this.setTitle(titleAttribute);
        this.getElement().removeAttribute('title'); //remove original DOM based tooltip
      }
      else {
        JX.$E('DOM node is missing \'title\' attribute');
        return;
      }
    }

    this.setTrigger(config.trigger);
    this.setPosition(config.position);
  },
  members: {
    present:false,
    tooltip:null,
    setPos: function() {
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
    show: function() {
      if(!this.present){
        this.tooltip = JX.$N('span',{className:'jx-tooltip'});
        var title = this.getTitle();
        JX.DOM.appendContent(this.tooltip, title);
        document.body.appendChild(this.tooltip);
        this.setPos();//position the tooltip correctly

        this._listeners = [];

        if (this.getTrigger() === 'hover') {
          var entryListener = JX.DOM.listen(this.tooltip, 'mouseover', null, JX.bind(this,function(e){
            clearTimeout(this._timerId);
          }));
          this._listeners.push(entryListener);

          var exitListener = JX.DOM.listen(this.tooltip, 'mouseout', null, JX.bind(this,function(e){
            if(!this.isDescendant(this.tooltip, e.getRawEvent().relatedTarget)){
              this.hide();
            }
          }));
          this._listeners.push(exitListener);
        }
      }
      this.present = true;
    },
    /**
     * Function to check if a DOM node is a descendant of another DOM node
     * TODO: Move to DOM.js maybe
     */
    isDescendant: function(parent, child) {
      var node = child.parentNode;
      while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
      }
      return false;
    },
    hide: function() {
      this._timerId = setTimeout(JX.bind(this, function(){
        this.present = false;
        JX.DOM.remove(this.tooltip);
        for(var i=this._listeners.length;i--;){
          this._listeners[i].remove();
        }
      }), 100);
    }
  },
  statics: {
    positions: ['top','bottom', 'left', 'right'],
    trigger: ['hover','focus','manual'] //TODO: For future validation purposes
  },
  properties: {
    element:null,
    trigger:null,
    position:null,
    title:null
  }
});

JX.behavior('show-tooltip', function(config, statics) {
  JX.Stratcom.listen(['mouseover','focus','mouseout','blur'], 'tooltip', JX.bind(this,function(e){
    var data = e.getNodeData('tooltip');

    var isEventActionable = !data.trigger ||
      (data.trigger === 'hover' && ['mouseover','mouseout'].indexOf(e.getType()) > -1) ||
      (data.trigger === 'focus' && ['focus','blur'].indexOf(e.getType()) > -1);

    if(!isEventActionable) return;

    var node = e.getTarget();

    var cachedObj = JX.Memoize.find(data._cacheId);

    if (cachedObj) {
      //console.log('cached');
      var obj = cachedObj;
    }
    else {
      //console.log('creating object');
      var obj = new JX.Tooltip(node, data);
      JX.Memoize.add(obj);
    }

    if (obj && !obj.getTrigger() ||
        (obj.getTrigger() === 'hover' && e.getType() === 'mouseover') ||
        (obj.getTrigger() === 'focus' && e.getType() === 'focus')
      ){
      obj.show();
    }

    if (obj && !obj.getTrigger() ||
        (obj.getTrigger() === 'hover' && e.getType() === 'mouseout') ||
        (obj.getTrigger() === 'focus' && e.getType() === 'blur')
      ){
      obj.hide();
    }
  }));
});