import DuplicateImage from "./helper/DuplicateImage";

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

export default function Toolbar() {
  return (
    <div className="flex flex-col items-center text-center bg-slate-500 w-full">
        <p className='text-white text-xl'>Toolbar</p>
        {Object.entries(getImages()).map(([type, source], index) => (
            <div key={index} className='w-[7rem] mt-10'>
                <DuplicateImage alt={type} source={source}/>
            </div>
        ))}
    </div>
  );
}