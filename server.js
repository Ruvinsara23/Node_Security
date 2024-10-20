const fs = require('fs')
const https =require('https');
const path = require('path');
const express =require('express')

const PORT=3000;
const app = express();
const HTTPS_PORT = 3443;

app.get('/secret',(req,res)=>{
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
