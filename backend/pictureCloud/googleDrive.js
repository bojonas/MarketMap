const connect = require("./connect");
const fs = require("fs")
const { Readable } = require('stream');

class GoogleDriveUploader{
    targetFile;
    uploadedFile;
    drive;

    constructor(file, fileType, name){
        this.drive = connect();
        this.targetFile = {
            name: `${name}.${fileType}`,
            mimeType: `image/${fileType}`
        };
        this.uploadedFile = {
            mimeType: `image/${fileType}`,
            body: this.bufferToStream(Buffer.from(file, 'base64'))
        };
    }
    bufferToStream(buffer) {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    async upload_file(){
        try{
            const response = await this.drive.files.create({
                requestBody: this.targetFile,
                media: this.uploadedFile
            })
            const permission_flag = await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: "reader",
                    type: "anyone"
                }
            });
            //console.log(permission_flag)
            return(`https://drive.google.com/thumbnail?id=${response.data.id}`)
        }
        catch(e){
            console.error(e)
        }
    }
}

module.exports = GoogleDriveUploader;

//uploader = new GoogleDriveUploader("/Users/benrohrig/Desktop/HDBW/Semester 4/FDT/kaufland_logo.png","jpg","test1")
//uploader.upload_file().then(id => console.log(id));