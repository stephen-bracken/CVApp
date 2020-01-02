const express = require("express");
const mongo = require('../scripts/mongo');
const hash = require('../scripts/hashing');

const router = express.Router();

var client = mongo.getClient();

// Log a user out
router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

router.get("/login", (req,res) => {
    if(typeof req.session.user == 'undefined'){
    res.render("login");
    }
    else{
        res.render("index");
    }
});

router.post("/login", (req,res) => {
    try{login(req,res);}
    catch(e){res.render("error");}
});

router.get("/create",(req,res) => {
    res.render("createuser");
});

router.post("/create",(req,res)=> {
    try{create(req,res);}
    catch(e){res.render("error");}
})

async function login(req,res){
    try{
    await client.connect();
    const encpass = hash.encrypt("0b61d2f2780f33b8b97139fb112b19fcedbca75b238d79be60b4d05f5c5aad85",req.body.pass);
    const find = await mongo.findUser(client,req.body.user,encpass);
    await client.close;
    if(typeof find !== 'undefined'){
    req.session.user = find;
    res.render("index");
    }
    else{
        req.session.user = undefined;
        res.render("login");
    }
    }
    catch(e) {throw e;}
}

async function create(req,res){
    try{
    await client.connect();
    const encpass = hash.encrypt("0b61d2f2780f33b8b97139fb112b19fcedbca75b238d79be60b4d05f5c5aad85",req.body.pass);
    const user = await mongo.createUser(client,
        {
            _id:req.body.user,
            password:encpass
        });
    req.session.user = user;
    await client.close;
    }
    catch(e){throw e;}
}

module.exports = router;