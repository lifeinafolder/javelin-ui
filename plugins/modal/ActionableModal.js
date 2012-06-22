JX.install('ActionModal', {
  extend:'Modal',
  construct: function(node, action, config) {
    config = config || {};
    config.lock = true;

    if (__DEV__) {
      if (!action) {
        JX.$E(
          'new JX.ActionableModal(node, <?>, ...): '+
          '\'action\' is required for ActionableModal to operate' );
      }
    }

    JX.Modal.call(this, node, config);
    this.setActionTitle(config.actionTitle || 'Ok');
    this.setAction(action);
    this.prepare();
  },
  members: {
    prepare: function() {
      var footer = JX.DOM.find(this.getContent(), 'div', 'modal-footer');
      var cancel = JX.$N('button',{className:'jx-modal-cancel'}, 'Cancel');
      var action = JX.$N('button',{className:'jx-modal-action'}, this.getActionTitle());
      footer.appendChild(action);
      footer.appendChild(cancel);
      JX.DOM.listen(cancel,'click',null, JX.bind(this, this.hide));
      JX.DOM.listen(action,'click',null, JX.bind(this, this.getAction()));
    }
  },
  statics: {
    checkMarkup: function (node) {
      try {
        var header = JX.DOM.find(node, 'div', 'modal-header');
        var footer = JX.DOM.find(node, 'div', 'modal-footer');
        return true;
      }
      catch(e) {
        console.log('No modal-header or modal-footer found:', e);
      }
      return false;
    }
  },
  properties : {
    actionTitle : null,
    action:null
  }
});

JX.behavior('actionable-modal', function(config, statics) {
  var source = config.source;
  delete config.source;

  var action = config.action;
  delete config.action;

  try { // Is it a DOM node?
    var isDomNode = document.querySelector(source);
    if (JX.ActionModal.checkMarkup(isDomNode)) {
      var modal = new JX.ActionModal(isDomNode, action, config);
    }
  }
  catch(e) {
    if (source.search(/https?:\/\//gi) === 0){ // Is it a remote URI ?
      var r = new JX.Request(source, function(response){
        if (JX.ActionModal.checkMarkup(response)) {
          var modal = new JX.ActionModal(response, action, config);
        }
      });
      r.setMethod('GET');
      r.send();
    }
    else {
      console.log( e ? e.message : 'Need DOM node to build an ActionableModal');
    }
  }
});