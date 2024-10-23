const fs = require('fs')
const path = require('path');
const https =require('https');
const helmet =require('helmet');
const express =require('express');
const passport = require('passport');
const {Strategy} = require('passport-google-oauth2')

require('dotenv').config();

const app = express();
const PORT=3000;
const HTTPS_PORT = 3443;

const config={
CLIENT_ID:'24486422144-oru6utiimfivh6ptrl800vg78pvka84c.apps.googleusercontent.com',
CLIENT_SECRET:'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'
    // CLIENT_ID:process.env.CLIENT_ID,
    // CLIENT_SECRET:process.env.CLIENT_SECRET,
};

const AUTH_OPTIONS ={
    callbackURL:'/auth/google/callback',
    clientID: config.CLIENT_ID,  // Changed from CLIENT_ID to clientID
    clientSecret: config.CLIENT_SECRET,  // Changed from CLIENT_SECRET to clientSecret
 }
 console.log('CLIENT_ID:', config.CLIENT_ID);
console.log('CLIENT_SECRET:', config.CLIENT_SECRET);

 function verifyCallback(accessToken,refreshToken,profile,done){
    console.log('Google profile',profile);
    done (null,profile)

 }

passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))

app.use(helmet());
app.use(passport.initialize());




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
    passport.authenticate('google',{
        scope: ['email'],
    })

})

app.get('/auth/google/callback',(req,res)=>{

passport.authenticate('google',{
    failureRedirect:'/failure',
    successRedirect:'/',
    session:false,
}),
(req,res)=>{
    console.log('google called us back')
}
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
