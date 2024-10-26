const fs = require('fs')
const path = require('path');
const https =require('https');
const helmet =require('helmet');
const express =require('express');
const passport = require('passport');
const cookieSession=require('cookie-session');
const {verify}=require('crypto')
const {Strategy} = require('passport-google-oauth2')
const session = require('express-session');
require('dotenv').config();
const events = require('events');


events.EventEmitter.defaultMaxListeners = 20;

const app = express();
const PORT=3000;
const HTTPS_PORT = 3443;

const config={
 CLIENT_ID:'24486422144-oru6utiimfivh6ptrl800vg78pvka84c.apps.googleusercontent.com',
CLIENT_SECRET:'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',
COOKIE_KEY_1: process.env.COOKIE_KEY_1,
COOKIE_KEY_2: process.env.COOKIE_KEY_2,

    // CLIENT_ID:process.env.CLIENT_ID,
    // CLIENT_SECRET:process.env.CLIENT_SECRET,
};

const AUTH_OPTIONS ={
    callbackURL:'http://localhost:3000/auth/google/callback'||'http://localhost:3443/auth/google/callback',
    clientID: config.CLIENT_ID,  // Changed from CLIENT_ID to clientID
    clientSecret: config.CLIENT_SECRET,  // Changed from CLIENT_SECRET to clientSecret
 }
 console.log('CLIENT_ID:', config.CLIENT_ID);
console.log('CLIENT_SECRET:', config.CLIENT_SECRET);

 function verifyCallback(accessToken,refreshToken,profile,done){
    console.log('Google profile',profile);
    done (null,profile)

 }

passport.use(new Strategy(AUTH_OPTIONS,verifyCallback));

//Save the session to cookies
passport.serializeUser((user, done) => {
    done(null, user); // Save the entire user profile in the session
});

passport.deserializeUser((user, done) => {
    done(null, user); // Directly use the profile as is
});


app.use(helmet());

app.use(session({
    secret: [config.COOKIE_KEY_1, config.COOKIE_KEY_2], // Use your keys as the secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 1000, // 1 day in milliseconds
        secure: false // Set to true if using HTTPS in production
    }
}));

// app.use(cookieSession({
//     name:'session',
//     maxAge: 60*60*24*1000,
//     keys:[config.COOKIE_KEY_1,config.COOKIE_KEY_2]
// }))
app.use(passport.initialize());
app.use (passport.session());





function checkloggedIn(req,res,next){
    console.log('Current user is:',req.user);
    const isLoggedIn = true;
    if(!isLoggedIn){
        return res.status(401).json({
            error:'you must log in!'
        })
    }
    next()
};

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
passport.authenticate('google',{
    failureRedirect:'/failure',
    successRedirect:'/',
    session:true,
}),
(req,res)=>{
    console.log('google called us back')
}
)

app.get('/failure', (req, res) => {
    return res.send('Fail to log');
});

app.get('/auth/logout',(req,res)=>{
    
})

app.get('/secret',checkloggedIn,(req,res)=>{
    console.log("Current use4r is ")
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
