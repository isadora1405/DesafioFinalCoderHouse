const router = require("express").Router();

router.get("/", (_request, response) =>{
    response.render('chat', {style: "chat.css"});
});

module.exports = router;