const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('home', {layout:false});
})

router.get('/realTimeProducts', (req, res)=>{
    res.render('realTimeProducts', {layout:false});
})

module.exports = router;