define(['AppView', 'text!templates/status.html'], function(AppView, statusTemplate) {
  var statusView = AppView.extend({
    tagName: 'li',

    render: function() {
      $(this.el).html(_.template(statusTemplate,this.model.toJSON()));
      return this;
    }
  });

  return statusView;
});
