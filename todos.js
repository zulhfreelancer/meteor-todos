// set todos collection global so that both client and server can access it
Todos = new Mongo.Collection("todos");

if (Meteor.isClient) {
  // template helper
  Template.main.helpers({
    todos: function(){
      return Todos.find();
    }
  });
}

if (Meteor.isServer) {

}
