export default function prepareList(mapping){
    let output = [];
    let usedItems = [];
    
    for (let i = 0; i<mapping.length;i++){
        //mapping[i] --> listItem_id, listItem, product_id, product_name, isAssigned
        let items = [];
        
        if(!usedItems.includes(mapping[i]["listItem"])&&mapping[i]["isAssigned"]) {
            usedItems.push(mapping[i]["listItem"])
            for (let j = 0; j<mapping.length;j++){   
                if(mapping[i]["listItem_id"]===mapping[j]["listItem_id"]){
                    items.push(mapping[j]["product_name"]);
                }
            }
            output.push({amount: mapping[i]["amount"], listItem: mapping[i]["listItem"], assignedItems: items});

        }
        
    }
    return output;
}