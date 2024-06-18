import { connect } from "./connect";
const fs = require("fs")


class RequestBody{
    targetFile;
    uploadedFile;
    drive;

    constructor(file, fileType, name){
        this.drive = connect();
        this.targetFile = {
            name: `${name}.${fileType}`,
            mimeType: `image/${fileType}`
        },
        this.uploadedFile = {
            mimeType: `image/${fileType}`,
            body: fs.createReadStream(file)
        }
    }
    async upload_file(){
        try{
            const response = await drive.files.create({
                requestBody: this.targetFile,
                media: this.uploadedFile
            })
            console.log(response.data)
            return(response.data.id)
        }
        catch(e){
            console.error(e)
        }
    }
}