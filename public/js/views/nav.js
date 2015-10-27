define(['text!templates/nav.html'], function(navTemplate) {
  var navView = Backbone.View.extend({
    el: $('#menu-nav'),
    render: function() {
      this.$el.html(navTemplate);
    }
  });

  return new navView;
});
