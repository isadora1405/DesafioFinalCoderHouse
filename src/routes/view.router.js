const express = require('express');
const router = express.Router();
const authMiddleware = require("./../middleware/auth-middleware.js");

router.get('/', (req, res)=>{
    res.render('home', {style: "index.css"});
})

router.get('/realTimeProducts', (req, res)=>{
    res.render('realTimeProducts', {style: "index.css"});
})

router.get('/products', authMiddleware, (req, res)=> res.render('products', {style: "products.css"}));

module.exports = router;