export function getImages() {
    const imageContext = require.context('./images', false, /\.png$/);

    const images = imageContext.keys().reduce((images, path) => {
      // remove the './' from the beginning of the path and the '.png' from the end
      const imageName = path.slice(2, -4);
      images[imageName] = imageContext(path);
      return images;
    }, {});
    return images;
}

function Toolbar() {
    return (
    <div className="flex flex-col items-center text-center bg-slate-500 w-full">
        {Object.entries(getImages()).map(([type, source]) => (
            <div className='w-[5rem] h-[5rem]'>
                <img src={source} alt={type}/>
            </div>
        ))}
    </div>
    );
}

export default Toolbar;