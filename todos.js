// set todos collection global so that both client and server can access it
Todos = new Mongo.Collection("todos");

if (Meteor.isClient) {
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
  		
  		Todos.insert({
  			text: text,
  			createdAt: new Date()
  		});

  		// clear form
  		event.target.text.value = "";

  		return false; // prevent form default
  	},
  	"click .toggle-checked": function(){
  		Todos.update(this._id, {
  			$set: {checked: !this.checked}
  			// let say the checkbox in the form is unchecked (false / not done)
  			// when we click it, we toggle it using `!` to make it true / done 
  		});
  	},
  	"click .delete-todo": function(){
  		if (confirm("Are you sure to delete this todo?")) {
  			Todos.remove(this._id);
  		};
  	}
  });
}

if (Meteor.isServer) {

}
