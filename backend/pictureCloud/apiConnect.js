const {google} = require("googleapis")
const fs = require("fs")

const CLIENT_ID = "228723591691-g142a9ud7hvaekuiap9ne29krrm0l37c.apps.googleusercontent.com"
const CLIENT_SECRET = "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"

const REDIRECT_URI = "https://developers.google.com/oauthplayground"

const REFRESH_TOKEN = "1//04LJULtMXeytRCgYIARAAGAQSNwF-L9Irw29Icy-lspMxnzF7i_Jo_MjXGiW7JiP82NHP97JOBgin4FJ20xs4elWOBF0YXlFQ5rw"

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

drive = google.drive({version: "v3", auth: oauth2Client})


const filePath = "/Users/benrohrig/Desktop/HDBW/Semester 4/FDT/kaufland_logo.png"

async function upload_file(){
    try{
        const response = await drive.files.create({
            requestBody: {
                name: "kaufland.png",
                mimeType: "image/png"
            },
            media:{
                mimeType: "image/jpg",
                body: fs.createReadStream(filePath)
            }
        })
        //console.log(response.data)
        //const link = await get_link(response.data.id)
        const link = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
        return(link)
    }
    catch(e){
        console.error(e)
    }
}

async function get_link(id){
    try{
        await drive.permissions.create({
            fileId: id,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        });
        
        const result = await drive.files.get({
            fileId: id,
            fields: "webViewLink"
        });
    
        return result.data.webViewLink
    }
    catch(error){
        console.error(error)
        return null
    }
    



}

//get_link("1rEkAnirELudfPxWoC7UGOkXp8LmeEI4I")

upload_file()