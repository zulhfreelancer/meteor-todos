// set todos collection global so that both client and server can access it
Todos = new Mongo.Collection("todos");

if (Meteor.isClient) {
  Meteor.subscribe("todos");

  // template helper
  Template.main.helpers({
    todos: function(){
      return Todos.find({}, {sort: {createdAt: -1 }});
    }
  });

  Template.main.events({
  	"submit .new-todo": function(event){
  		var text = event.target.text.value;
  		// --------------------- ^ input `name` attribute
  		
  		Meteor.call("addTodo", text);

  		// clear form
  		event.target.text.value = "";

  		return false; // prevent form default
  	},
  	"click .toggle-checked": function(){
  		Meteor.call("setChecked", this._id, !this.checked)
  	},
  	"click .delete-todo": function(){
  		if (confirm("Are you sure to delete this todo?")) {
  			Meteor.call("deleteTodo", this._id)
  		};
  	}
  });

  Accounts.ui.config({
  	passwordSignupFields: "USERNAME_ONLY" // require username only (remove email)
  })
}

if (Meteor.isServer) {
	Meteor.publish("todos", function(){
    if (!this.userId) {
      // is user not logged in, show all users todos
      return Todos.find();
    } else {
      // if user is logged in, only show that user's todos
      return Todos.find({userId: this.userId});
      // ------------------------ ^^^^^^^^^ only show logged in user's todos
    }
	});
}

// production CRUD access
Meteor.methods({
	addTodo: function(text){
		// if user not logged in, show error
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorize")
		}
		Todos.insert({
  			text: text,
  			createdAt: new Date(),
  			userId: Meteor.userId(),
  			username: Meteor.user().username
  		});
	},
	deleteTodo: function(todoId){
		// prevent todo deletion if a user want to delete another user's todo
		var todo = Todos.findOne(todoId);
		if (todo.userId !== Meteor.userId()) {
			throw new Meteor.Error("not-authorize");
		}
		Todos.remove(todoId);
	},
	setChecked: function(todoId, setChecked){
		// prevent todo from being updated if a user want to update another user's todo
		var todo = Todos.findOne(todoId);
		if (todo.userId !== Meteor.userId()) {
			throw new Meteor.Error("not-authorize");
		}
		Todos.update(todoId, {
  			$set: {checked: setChecked}
  		});
	}
});
