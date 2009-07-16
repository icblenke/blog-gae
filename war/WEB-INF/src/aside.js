var db = require("google/appengine/ext/db"),
    memcache = require("google/appengine/api/memcache");

var Category = require("./content/category").Category,
    Comment = require("./content/comment").Comment;

var Template = require("template").Template;

var template;

exports.Aside = function(response) {
    var aside = memcache.get("aside");
    
    if (!aside) {
        template = template || Template.load(CONFIG.templateRoot + "/aside.inc.html");
        aside = template.render({ 
            categories: Category.all().fetch(),
            comments: Comment.all().order("-created").limit(5)
        });      
        memcache.set("aside", aside);  
    }
             
    response.aside = aside;             
    
    return response;
}
