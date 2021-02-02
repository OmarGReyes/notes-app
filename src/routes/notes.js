const express = require("express");
const router = express.Router();

const Note = require('../models/Note') //Utilizar schema de la BD

router.get("/notes/add", (req, res) => {
  res.render("notes/new-notes");
});

router.post("/notes/new-note", async (req, res) => {
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
      await newNote.save() //Almacenamos en la BD
      res.redirect('/notes')
  }
  console.log(req.body);
});

router.get('/notes', async (req, res) => {
    await Note.find().sort({date:'desc'})
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

router.get('/notes/edit/:id', async (req,res)=>{ 
    const note = await Note.findById(req.params.id).lean();    //Importante
    //.lean para evtar el error de handlebars
    res.render('notes/edit-note',{note})
    
 
})

router.put('/notes/edit-note/:id', async(req,res)=>{
  const {title,description}= req.body;
  await Note.findByIdAndUpdate(req.params.id, {title,description});
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', async(req,res)=>{
  await Note.findByIdAndDelete(req.params.id)
  res.redirect('/notes')
})



module.exports = router;
