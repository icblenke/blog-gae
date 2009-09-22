// Customize the Article model.

var Article = require("content/article").Article,
    Taggable = require("content/taggable").Taggable;
    
Taggable.extend(Article);
