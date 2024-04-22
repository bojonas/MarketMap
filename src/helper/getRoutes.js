export function getRoutes() {    
    // get all components from routes folder
    const routes = require.context('../routes', true, /\/[A-Za-z0-9-_,\s]+\/[A-Za-z0-9-_,\s]+\.jsx$/);
    return routes.keys().filter(key => {
        // filename matches folder name
        const pathParts = key.split('/');
        const folderName = pathParts[pathParts.length - 2];
        const fileName = pathParts[pathParts.length - 1].replace('.jsx', '');
        return folderName === fileName;
        }).map(key => {
        const Component = routes(key).default;
        const route = key.replace(/(\.\/|\/[A-Za-z0-9-_,\s]+\.jsx)/g, '');
        const name = route.replace(/([A-Z])/g, ' $1').trim();
        return { name, route, Component };
    });
}