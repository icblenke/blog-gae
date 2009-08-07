var db = require("google/appengine/ext/db"),
    memcache = require("google/appengine/api/memcache");

var Category = require("./content/category").Category,
    Comment = require("./content/comment").Comment;

var loadTemplate = require("nitro/utils/template").Template.load;
var template;
    
exports.Wrap = function(app) {

    return function(env) {
        var response = app(env);

        if (typeof(response[2]) != "string") {
            if (env["REQUEST_METHOD"] == "GET") { // FIXME: check for text/html content type!
                var data = response[2];
 
                var aside = memcache.get("aside");
                
                if (!aside) {
                    if (!template) template = loadTemplate("/aside.inc.html");
                    aside = template.render({ 
                        categories: Category.all().fetch(),
                        comments: Comment.all().order("-created").limit(5)
                    });      
                    memcache.set("aside", aside);  
                }

                data.aside = aside;             
  
                if (!data.metaKeywords)
                    data.metaKeywords = "nitro,blog,example,javascript";

                response[2] = data;
            }
        }
        
        return response;
    }

}
