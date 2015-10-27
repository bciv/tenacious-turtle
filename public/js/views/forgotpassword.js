define(['AppView','text!templates/forgotpassword.html'], function(AppView,forgotpasswordTemplate) {
  var forgotpasswordView = AppView.extend({
    requireLogin: false,
    
    el: $('#content'),

    events: {
      "submit form": "password"
    },

    password: function() {
      $.post('/forgotpassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(forgotpasswordTemplate);
    }
  });

  return forgotpasswordView;
});