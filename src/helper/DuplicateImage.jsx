import { useDrag } from 'react-dnd';

export default function DuplicateImage({ alt, source }) {
  const [, drag] = useDrag({
    type: 'image',
    item: { alt, source },
  });

  return (
    <img ref={drag} src={source} alt={alt} />
  );
}