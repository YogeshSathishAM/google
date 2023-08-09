const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const ejs = require("ejs")
const axios = require("axios") // axios is used to make a request to an API unlike app.get/post which is used to handle a request from browser

app.use(express.static(path.join(__dirname,'views'))) // the views where submit button is added and username, password slot is added via html, we have to mention the path of that view folder here in server.js
app.use(express.json()) // getting data from browser, its not readable, hence we are converting to json

app.use(express.urlencoded({extended:true})) 

// Google OAuth 2.0 credentials
const googleClientId = '437217891511-39ii7e3mjnqq6qmh6qssomoag7b12asb.apps.googleusercontent.com';
const googleClientSecret = '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';

// Route to initiate Google OAuth 2.0 sign-in
app.get('/auth/google', (req, res) => {
    const redirectURI = 'http://localhost:3000/auth/google/callback';

const googleAuthURL =`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectURI}&scope=openid%20profile&response_type=code`; 
console.log(googleAuthURL)
res.redirect(googleAuthURL);
});

// Callback route to handle Google OAuth 2.0 callback
app.get('/auth/google/callback', async (req, res) => {
    console.log("/auth/google/callback")
const code = req.query.code;

if (code) {
try {

// Exchange the authorization code for access token
const tokenResponse = await
axios.post('https://oauth2.googleapis.com/token', null, {
params: {
code,
client_id: googleClientId,
client_secret: googleClientSecret,
redirect_uri: googleRedirectURL,
grant_type: 'authorization_code',
},
});

const tokenData = tokenResponse.data;

// Fetch user information using the access token
const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', 
{
headers: {
Authorization: `Bearer ${tokenData.access_token}`,
},
});

const userInfo = userInfoResponse.data;

// Here, you can handle user data and store it in your session or database
req.session.user = userInfo;
res.redirect('/profile');
} 

catch (error) {
console.error(error);
res.redirect('/');
}
} 
else {
res.redirect('/');
} });

// Profile route to display user information

app.get('/profile', (req, res) => {

if (req.session.user) {
res.send(`Welcome, ${req.session.user.name}`);
} 
else {
res.redirect('/');
}
});

app.listen(3300,(req,res)=>{
    console.log("listening to server 3300")
})