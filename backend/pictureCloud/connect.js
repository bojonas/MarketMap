function connect(){
    const {google} = require("googleapis")

    const CLIENT_ID = "228723591691-g142a9ud7hvaekuiap9ne29krrm0l37c.apps.googleusercontent.com"
    const CLIENT_SECRET = "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"

    const REDIRECT_URI = "https://developers.google.com/oauthplayground"

    const REFRESH_TOKEN = "1//04LJULtMXeytRCgYIARAAGAQSNwF-L9Irw29Icy-lspMxnzF7i_Jo_MjXGiW7JiP82NHP97JOBgin4FJ20xs4elWOBF0YXlFQ5rw"

    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

    drive = google.drive({version: "v3", auth: oauth2Client})
    //console.log(drive)
    return drive
}

module.exports = connect;