export function getTabs(tabPermission) {    
    // get all components from tabs folder
    const tabs = require.context('../tabs', true, /\/[A-Za-z0-9-_,\s]+\/[A-Za-z0-9-_,\s]+\.jsx$/);
    const icons = require.context('../icons', true, /\/[A-Za-z0-9-_,\s]+Icon\.jsx$/);

    return tabs.keys().filter(key => {
        // filename matches folder name
        const pathParts = key.split('/');
        const folderName = pathParts[pathParts.length - 2];
        const fileName = pathParts[pathParts.length - 1].replace('.jsx', '');
        return folderName === fileName;
    }).map(key => {
        const Component = tabs(key).default;
        let tab = key.replace(/(\.\/|\/[A-Za-z0-9-_,\s]+\.jsx)/g, '');
        const name = tab.replace(/([A-Z])/g, ' $1').trim();

        // find corresponding icon
        const iconKey = icons.keys().find(iconKey => iconKey.includes(`${tab}Icon`));
        const Icon = iconKey ? icons(iconKey).default : null;

        // set permission
        const permission = tabPermission.find(item => item.name === name).permission;

        // change Home route to /
        if (tab === 'Home') tab = '';
        return { name, tab, Component, Icon, permission };
    });
}