require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Bootstrap: '/js/libs/bootstrap',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    models: 'models',
    text: '/js/libs/text',
    templates: '../templates',
    
    AppView: '/js/AppView'
  },

  shim: {
    'Backbone': ['jQuery', 'Underscore'],
    'App': ['Backbone']
  }
});

require(['App'], function(App) {
  App.initialize();
});