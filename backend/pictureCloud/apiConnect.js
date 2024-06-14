const {google} = require("googleapis")

console.log("Works")
const CLIENT_ID = "228723591691-g142a9ud7hvaekuiap9ne29krrm0l37c.apps.googleusercontent.com"
const CLIENT_SECRET = "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"

const REDIRECT_URI = "https://developers.google.com/oauthplayground"

const REFRESH_TOKEN = "1//0fAmFACdfUxA9CgYIARAAGA8SNwF-L9IrcjNqPKqVvy8TjkVEymoqUeO94XwinnirX4TNtTFiXhN2GhAB42x2TvIzVKOW5rBzFkc"

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

console.log("End")