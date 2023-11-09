// here we will add database and connectors and all
const mongoose = require('mongoose');//now connect to database
mongoose.connect(process.env.MongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//now set database connection
const db = mongoose.connection;
//check it its connected or not...first checking for error 
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', function(){
    console.log('Connected');
})

//now create first model category
//model os basically collection of data and can be designed in the way database is structured

//models
require('./Category');
require('./Blog');
