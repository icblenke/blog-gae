var update = require("hash").Hash.update;

var render = require("nitro/response").render;

// Dynamic generation of the css from a template in src/screen.css
// Mainly to demonstrate what is possible.
exports.GET = function(env) {
    var response = render({
        gray: "#eee"        
    });
    
    update(response[1], {
        "Content-Type": "text/css",
        "Cache-Control": "public; max-age=8640000"
    })
    
    return response;
}

