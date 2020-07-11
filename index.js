const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3100;
const mongoose=require('mongoose');
const bodyParser=require('body-parser')
const {MONGOURI}=require('./keys');
const geoRouter = require('./routes/geo');
const reportsRouter = require('./routes/report');



mongoose.connect(MONGOURI,{	
	useNewUrlParser: true,
	 useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
	console.log("connected to monnodess");
});	
mongoose.connection.on('error',(err)=>{
	console.log("err connected to monnodess",err);
})

// after the connection is established then this code 
require('./models/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static('static'))
app.use(express.json());
app.use(express.urlencoded())
app.use(require('./routes/auth'));	


app.use('/geo/', geoRouter);
app.use('/reports/', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});