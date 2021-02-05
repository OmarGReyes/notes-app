const express = require("express");
const router = express.Router();

const Note = require('../models/Note') //Utilizar schema de la BD

const {isAuth} = require('../helpers/auth')

router.get("/notes/add", isAuth,(req, res) => {
  res.render("notes/new-notes");
});

router.post("/notes/new-note", isAuth,async (req, res) => {
  const { title, description } = req.body;
  let errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title" });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }

  if (errors.length > 0) {
    res.render("notes/new-notes", {
      errors,
      title,
      description,
    });
  } else {
      const newNote = new Note({title,description})
      newNote.user = req.user.id 
      await newNote.save() //Almacenamos en la BD
      req.flash('success_msg', 'Note added Successfully')
      res.redirect('/notes')
  }
  console.log(req.body);
});

router.get('/notes', isAuth,async (req, res) => {
    await Note.find({user: req.user.id}).sort({date:'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                title: documento.title,
                description: documento.description,
                _id:documento._id,

            }
          })
        }
        res.render('notes/all-notes', {
 notes: contexto.notes }) 
      })
  })

router.get('/notes/edit/:id', isAuth,async (req,res)=>{ 
    const note = await Note.findById(req.params.id).lean();    //Importante
    //.lean para evtar el error de handlebars
    res.render('notes/edit-note',{note})
    
 
})

router.put('/notes/edit-note/:id', isAuth,async(req,res)=>{
  const {title,description}= req.body;
  await Note.findByIdAndUpdate(req.params.id, {title,description});
  req.flash('success_msg', 'Note edited Successfully')
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuth,async(req,res)=>{
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Note deleted Successfully')
  res.redirect('/notes')
})



module.exports = router;
