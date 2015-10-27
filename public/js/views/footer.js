define(['text!templates/footer.html'], function(footerTemplate) {
  var footerView = Backbone.View.extend({
    el: $('#footer'),
    render: function() {
      this.$el.html(footerTemplate);
    }
  });

  return new footerView;
});
