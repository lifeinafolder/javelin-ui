JX.behavior('tokenizer', function(config) {
  var source = new JX.TypeaheadPreloadedSource(config.preloadedURI);
  var typeahead = new JX.Typeahead(JX.$(config.preloadedHardpoint));

  typeahead.setDatasource(source);
  typeahead.start();

  var tokenizer = new JX.Tokenizer(JX.$(config.preloadedHardpoint));
  tokenizer.setTypeahead(typeahead);
  tokenizer.start();
});
