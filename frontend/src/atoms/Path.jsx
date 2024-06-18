import { isEqualArray } from '../helper/isEqualArray';

const cornerStyles = {
    'top-right': { horizontal: 'translate(-0%, -50%)', vertical: 'translate(-50%, -0%)' },
    'left-bottom': { horizontal: 'translate(-0%, -50%)', vertical: 'translate(-50%, -0%)' },
    'bottom-left': { horizontal: 'translate(-100%, -50%)', vertical: 'translate(-50%, -100%)' },
    'right-top': { horizontal: 'translate(-100%, -50%)', vertical: 'translate(-50%, -100%)' },
    'right-bottom': { horizontal: 'translate(-100%, -50%)', vertical: 'translate(-50%, -0%)' },
    'top-left': { horizontal: 'translate(-100%, -50%)', vertical: 'translate(-50%, -0%)' },
    'bottom-right': { horizontal: 'translate(-0%, -50%)', vertical: 'translate(-50%, -100%)' },
    'left-top': { horizontal: 'translate(-0%, -50%)', vertical: 'translate(-50%, -100%)' },
};

function checkDirection(array, currentRow, currentCol, coordIndex) {
    let direction = '';
    if (coordIndex > 0 && coordIndex < array.length - 1) {
      const prevCoord = array[coordIndex - 1];
      const nextCoord = array[coordIndex + 1];
      if (prevCoord[0] === currentRow && nextCoord[1] === currentCol) {
        direction = `${prevCoord[1] > currentCol ? 'left' : 'right'}-${nextCoord[0] > currentRow ? 'bottom' : 'top'}`;
      } else if (prevCoord[1] === currentCol && nextCoord[0] === currentRow) {
        direction = `${prevCoord[0] > currentRow ? 'top' : 'bottom'}-${nextCoord[1] > currentCol ? 'right' : 'left'}`;
      }
    }
    return direction;
}

export default function Path({ path, currentRow, currentCol, waypoints, scale }) {
    if (path.length === 0 || isEqualArray(path[0], [currentRow, currentCol]) || isEqualArray(path[path.length-1], [currentRow, currentCol])) return;
    const coordIndex = path.findIndex(([row, col]) => row === currentRow && col === currentCol);
    if (coordIndex === -1) return null;
    
    let orientation = 'horizontal';
    if (coordIndex < path.length - 1) {
      const nextCoord = path[coordIndex + 1];
      if (nextCoord[1] === currentCol) {
        orientation = 'vertical';
      }
    }
    
    let divs = [];
    const cornerType = checkDirection(path, currentRow, currentCol, coordIndex);
    if (!cornerType ) {
        const [row, col] = path[coordIndex-1];
        const [afterRow, afterCol] = path[coordIndex+1];
        if (waypoints.length > 0 && (currentRow + currentRow - row !== afterRow || currentCol + currentCol - col !== afterCol)) {
            let translateX = -50, translateY = -50;
            if (row < currentRow) translateY = -100;
            if (row > currentRow) translateY = 0;
            if (col < currentCol) translateX = -100;
            if (col > currentCol) translateX = 0;
            divs = [
                <div key='initial' className='absolute top-1/2 left-1/2 bg-custom' 
                style={{ 
                    width: orientation === 'horizontal' ? `${scale/2}px` : `${scale/10}px`,
                    height: orientation === 'vertical' ? `${scale/2}px` : `${scale/10}px`,
                    transform: `translate(${translateX}%, ${translateY}%)`,
                }}/>
            ];
        } else divs = [
            <div key='initial' className='absolute top-1/2 left-1/2 bg-custom' 
            style={{ 
                width: orientation === 'horizontal' ? `${scale}px` : `${scale/10}px`,
                height: orientation === 'vertical' ? `${scale}px` : `${scale/10}px`,
                transform: 'translate(-50%, -50%)',
            }}/>
        ];
    } else {
        let divWidth = scale/2, divHeight = scale/2;
        // check if more than 1 adjacent cell in path
        let adjacentsSet = new Set();
        path.forEach(([i, j]) => {
            if ((Math.abs(currentRow - i) === 1 && currentCol === j) || (Math.abs(currentCol - j) === 1 && currentRow === i)) adjacentsSet.add(JSON.stringify([i, j]));
        });
        const adjacents = Array.from(adjacentsSet, JSON.parse);
        let { horizontal: horizontalStyle, vertical: verticalStyle } = cornerStyles[cornerType] || { horizontal: '', vertical: '' }; 
        
        if (adjacents.length === 3) {
            const sameRowElements = adjacents.filter((item, index, array) => 
                array.find((_, i) => i !== index && item[0] === array[i][0])
            );
            const sameColElements = adjacents.filter((item, index, array) => 
                array.find((_, i) => i !== index && item[1] === array[i][1])
            );
            if (sameRowElements.length === 2) {
                //divWidth = scale;
                //horizontalStyle = 'translate(-50%, -50%)';
            } else if (sameColElements.length === 2) {
                //divHeight = scale;
                //verticalStyle = 'translate(-50%, -50%)';
            }
        }    
        if (adjacents.length === 4) {
            divWidth = scale;
            horizontalStyle = 'translate(-50%, -50%)';
            divHeight = scale;
            verticalStyle = 'translate(-50%, -50%)';
        }

        divs = [
            <div key='initial'>
                <div className='absolute top-1/2 left-1/2 bg-custom'
                style={{ 
                    width: `${divWidth}px`,
                    height: `${scale/10}px`,
                    transform: horizontalStyle,
                }}/>
                <div className='absolute top-1/2 left-1/2 bg-custom'
                style={{ 
                    width: `${scale/10}px`,
                    height: `${divHeight}px`,
                    transform: verticalStyle,
                }}/>
            </div>
        ];
    }

    // add waypoint connection
    if (waypoints.length > 0) {
        waypoints.forEach(([row, col], i) => {
            let translateX = -50, translateY = -50;
            if (row < currentRow) translateY = -100;
            if (row > currentRow) translateY = 0;
            if (col < currentCol) translateX = -100;
            if (col > currentCol) translateX = 0;
            divs.push(
                <div key={`waypoint-${i}`} className='absolute top-1/2 left-1/2 bg-custom' 
                style={{ 
                    width: row === currentRow ? `${scale/2}px` : `${scale/10}px`,
                    height: col === currentCol ? `${scale/2}px` : `${scale/10}px`,
                    transform: `translate(${translateX}%, ${translateY}%)`,
                }}/>
            );
        });        
    }
    return divs;
}