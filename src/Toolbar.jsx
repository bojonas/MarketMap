import Draggable from "react-draggable";

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
    <div className="text-center justify-center bg-slate-500 w-full">
        <p className="text-white">This is a toolbar</p>
        {Object.entries(getImages()).map(([type, source]) => (
            <div className='w-[5rem] h-[5rem]'>
                <Draggable>
                    <img src={source} alt={type}/>
                </Draggable>
            </div>
        ))}
    </div>
    );
}

export default Toolbar;