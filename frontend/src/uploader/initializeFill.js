export const initializeFill = (displayMapping, setSelectedItem)=>{
    let selectedItemInitialFiller = {};
    for(let i = 0; i<displayMapping.length;i++){
        selectedItemInitialFiller[i] = displayMapping[i]["assignedItems"][0]
    }
    setSelectedItem(selectedItemInitialFiller)
}