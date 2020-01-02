const express = require("express");
const fs = require("fs");
const formidable = require('formidable');

const router = express.Router();

// Display the dashboard page
router.get("/", (req, res) => {
  res.render("cv");
});

router.get("/cvsuccess",(req,res) => {
    res.render("cvsuccess");
})

router.post("/fileupload",(req,res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (!files.filetoupload.name.endsWith('.pdf') && !files.filetoupload.name.endsWith('.doc') && !files.filetoupload.name.endsWith('.docx')) {
            res.render("wrongfile")
        }
        else {
            var oldpath = files.filetoupload.path;
            var newpath = './cv/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.redirect("/cv/cvsuccess");
            });
        }
    });
})

module.exports = router;