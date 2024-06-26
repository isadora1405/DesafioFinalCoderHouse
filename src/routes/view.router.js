const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('home', {style: "index.css"});
})

router.get('/realTimeProducts', (req, res)=>{
    res.render('realTimeProducts', {style: "index.css"});
})

module.exports = router;