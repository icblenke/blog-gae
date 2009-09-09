var db = require("google/appengine/ext/db"),
    memcache = require("google/appengine/api/memcache");

var Category = require("./content/category").Category,
    Comment = require("./content/comment").Comment;

exports.Wrap = function(app) {

    return function(env) {
        var response = app(env);

        // FIXME: check for text/html content type!
        if (response.data) {
            data = response.data;
            
            var aside = memcache.get("aside");                
            if (!aside) {
                template = env["nitro.template_manager"].load("/aside.inc.html");
                aside = template.render({ 
                    categories: Category.all().fetch(),
                    comments: Comment.all().order("-created").limit(5)
                });      
                memcache.set("aside", aside);  
            }

            data.aside = aside;             

            if (!data.metaKeywords)
                data.metaKeywords = "nitro,blog,example,javascript";
        }
        
        return response;
    }

}
