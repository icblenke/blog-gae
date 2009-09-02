var db = require("google/appengine/ext/db");

var redirect = require("jack/response").Response.redirect;

var Category = require("content/category").Category,
	Article = require("content/article").Article,
	Comment = require("content/comment").Comment,
	Tag = require("content/tag").Tag;
	
exports.GET = function(env) {	
	var models = [Category, Article, Comment, Tag];
	for (var i = 0; i < models.length; i++) db.remove(models[i].all().keys());
	
	var categories = [
	    new Category("art", "Art"),
	    new Category("business", "Business"),
	    new Category("dogma", "Dogma"),
	    new Category("life", "Life"),
	    new Category("technology", "Technology")
	];
	db.put(categories);
	
	return redirect("/");
}
