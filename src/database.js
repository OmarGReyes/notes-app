const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex:true, //Obligatoria
    useNewUrlParser:true, //Obligatoria
    useFindAndModify:false
}).then(db => console.log('DB is connected'))
  .catch(err=>console.log(err));  