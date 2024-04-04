import { useDrag } from 'react-dnd';

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

function DraggableImage({ type, source }) {
  const [, drag] = useDrag({
    type: 'image',
    item: { type, source },
  });

  return (
    <img ref={drag} src={source} alt={type} />
  );
}

export default function Toolbar() {
  return (
    <div className="flex flex-col items-center text-center bg-slate-500 w-full">
        <p className=''>Toolbar</p>
        {Object.entries(getImages()).map(([type, source]) => (
            <div className='w-[5rem] h-[5rem]'>
                <DraggableImage type={type} source={source} />
            </div>
        ))}
    </div>
  );
}