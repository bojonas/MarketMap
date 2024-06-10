import mammoth from 'mammoth';

export async function parseFile(file, type){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                var result;
                if(type === "docx"){
                    const arrayBuffer = e.target.result;
                    result = (await mammoth.extractRawText({ arrayBuffer })).value;
                }
                else{
                    result = e.target.result;
                }
                const output = parseFileHelper(result)
                resolve({output: output, text: result}); 
            };
            reader.onerror = (e) => {
                reject(e); 
            };
            if(type === "docx"){
                reader.readAsArrayBuffer(file);
            }
            else if (type === "txt"){
                reader.readAsText(file);
            }
            else{
                reject("Invalid File Type")
            }

        });
    }

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function parseFileHelper(text){
    var rawData = text.split('\n');
    var output = [];
    for(let i=0; i<rawData.length; i++){
        
        if(rawData[i][0] in numbers){
            let j = 0
            while((rawData[i][j] in numbers)){
                j+=1;
            }

            output.push({id: i, product: rawData[i].substring(j+1,rawData[i].length).trim(), amount: Number(rawData[i].substring(0,j))});
        }
        else if(rawData[i]===""){} //ignore empty lines
        else{
            output.push({id: i, product: rawData[i].trim(), amount: 1});
        }
    }

    return output
}

export function parseText(text){
    return parseFileHelper(text)
}