const express = require('express');
const app = express();

const cors = require('cors');
const knex = require('knex');

const register=require('./controllers/register');
const signin = require('./controllers/signin');
const profile=require('./controllers/profile');
const image=require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl:true
    }
});

// db.select('*').from('users')
// .then(data=>console.log(data));

// *** for bcrypt-nodejs
const bcrypt = require('bcrypt-nodejs');


// *** for bcrypt
// const bcrypt=require('bcrypt');
// const saltRounds = 10 // increase this if you want more iterations  



// Middlewares **********
app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(cors());

//********************* */



app.get('/', (req, res) => {
    res.json('it is working')
});



app.post('/signin', (req, res)=>{signin.handleSignin(req,res,db,bcrypt)} );


app.post('/register', (req,res)=>{register.handleRegister(req,res,db,bcrypt)});

app.get('/profile/:id', (req,res)=>{profile.handleProfileGet(req,res,db)});

app.put('/image', (req,res)=>{image.handleImage(req,res,db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening to PORT ${process.env.PORT}`)
});



