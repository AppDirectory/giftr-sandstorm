Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('directory'),
      Meteor.subscribe('users')
    ];
  }
});



Router.route('/', {
    name: "directory",
    waitOn: function () {
        return Meteor.subscribe('directory');
    },
});

Router.route('/lists/:_id', {
  name: "lists.show",
  waitOn: function () {
      return [
        Meteor.subscribe('items', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
  },
  data: function(data) {
    if (!data) {
      return Lists.findOne(this.params._id);
    } else {
      console.log(data);
      this.next();
    }
  }

});

Router.route('/about', {
  name: "about"
});

// force login
Router.onBeforeAction(function () {
  var path = Iron.Location.get().path;
  Meteor.defer(function () {
      window.parent.postMessage({'setPath': location.pathname + location.hash}, '*');
  });
  if (!Meteor.userId()) {
    this.render('Logup');
  } else {
    this.next();
  }
});
