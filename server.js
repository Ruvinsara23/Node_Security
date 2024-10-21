const fs = require('fs')
const path = require('path');
const https =require('https');
const helmet =require('helmet');
const express =require('express');

const PORT=3000;
const HTTPS_PORT = 3443;

const app = express();



function checkloggedIn(req,res,next){
    const isLoggedIn = true;
    if(!isLoggedIn){
        return res.status(401).json({
            error:'you must log in!'
        })
    }
    next()
};

app.get('/auth/google',(req,res)=>{

})

app.get('/auth/google/callback',(req,res)=>{


})

app.get('auth/logout',(req,res)=>{
    
})

app.get('/secret',checkloggedIn,(req,res)=>{
    return res.send('Your personal secret value 43')
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.listen(PORT,()=>{
    console.log(`Listning on port ${PORT}..`)
})

https.createServer({
    key:fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),

},app).listen(HTTPS_PORT,()=>{
    console.log(`Listening on port ${HTTPS_PORT}..`)
})
