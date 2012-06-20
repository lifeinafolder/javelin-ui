/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Form Plugin
 *
 * @group Plugin
 */
JX.install('Form', {
  construct: function(uri){
    this.setUri(uri);
  },
  events:['start','done','invalid'],
  members: {
    _cbk: function(response){
      this.invoke('done',{a:5});
    },
    validate: function(){
      return true;
    },
    submit: function(){
      this.invoke('start');
      var isValid = this.validate();
      if (!isValid){
        this.invoke('invalid');
        return;
      }

      var r = new JX.Request(this.getUri(), JX.bind(this,this._cbk));
      r.setData();
      r.send();
    }
  },
  properties: {
    uri:null
  }
});


JX.behavior('form', function(config, statics) {
  JX.Stratcom.listen('submit','form',function(e){
    var data = e.getNodeData('form');
    var target = e.getTarget();
    var action = target.getAttribute('action') || data.uri;
    e.kill();

    var f = new JX.Form(action);

    // // If an 'invalid' is received, disable the 'submit' button
    // f.listen('invalid',function(){
    //   target.setAttribute('disabled',true);
    // })
    f.listen('done',data.onDone);
    f.submit();
  });
});