import { requestGetProducts } from "../requests/homeRequests";
export default async function assignProducts(contentArray){
    var allProoducts;
    var mapping = [];
    allProoducts = await requestGetProducts();

    for(let i = 0; i<contentArray.length;i++){
        var itemFound = false
        for(let j = 0; j<allProoducts.length;j++){
            if(allProoducts[j]["product_name_en"].toLowerCase().includes(contentArray[i]["product"].toLowerCase().trim())){
                mapping.push({listItem_id: contentArray[i]["id"],listItem: contentArray[i]["product"], amount: contentArray[i]["amount"], product_id: allProoducts[j]["product_id"], product_name: allProoducts[j]["product_name_en"], isAssigned: true });
                itemFound = true;
            }
        }
        if(!itemFound){
            mapping.push({listItem_id: contentArray[i]["id"],listItem: contentArray[i]["product"], isAssigned: false});
        }
    }

    return mapping
}