var db = require("google/appengine/ext/db");

var Category = require("./content/category").Category,
    Comment = require("./content/comment").Comment;

exports.Aside = function(response) {
	categories = Category.all()
    response.asideCategories = categories.fetch();
    response.asideLatestComments = [];
    return response;
//	Hash.update(env, { 
////        	db.query("SELECT id, label, term FROM Category ORDER BY label").all(Category).map(function(c) {
////            c.path = c.path();
////            return c;
////        }),
////        asideLatestComments: db.query("SELECT c.name, c.created, c.parentId, a.title AS articleTitle FROM Comment AS c JOIN Article AS a ON c.parentId=a.id ORDER BY c.created DESC LIMIT 10").all(Comment)
//    });
//    
//    return [null, null, env];
}
