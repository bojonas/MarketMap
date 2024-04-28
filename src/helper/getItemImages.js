export function getItemImages() {
    const imageContext = require.context('../itemImages', false, /\.png$/);

    const images = imageContext.keys().reduce((images, path) => {
      // remove the './' from the beginning of the path and the '.png' from the end
      const imageName = path.slice(2, -4);
      images[imageName] = imageContext(path);
      return images;
    }, {});
    return images;
}
