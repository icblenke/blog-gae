var Request = require("nitro/request").Request,
    redirect = require("nitro/response").Response.redirect;

var Article = require("content/article").Article;
    
var ModelForm = require("google/appengine/ext/db/forms").ModelForm,
    ArticleForm = ModelForm(Article);

exports.POST = function(env) {
    var params = new Request(env).params();
    
    var article = params.key ? Article.get(params.key) : new Article();
    
    var form = new ArticleForm(params, {instance: article});
    article.created = article.updated = new Date();
    article.updateTags(params.tagsString);    
    form.put();

    return redirect("/");
}

