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
	    new Category({keyName: "art", label: "Art"}),
	    new Category({keyName: "business", label: "Business"}),
	    new Category({keyName: "dogma", label: "Dogma"}),
	    new Category({keyName: "life", label: "Life"}),
	    new Category({keyName: "technology", label: "Technology"})
	];
	db.put(categories);
	
	return redirect("/");
}
