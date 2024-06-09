export function getNonBorderStyle(scale) {
    return {
        borderTopLeftRadius: `${scale/5}px`,
        borderTopRightRadius: `${scale/5}px`,
        borderBottomLeftRadius: `${scale/5}px`,
        borderBottomRightRadius: `${scale/5}px`,
        borderTopWidth: `${scale/10}px`,
        borderTopStyle: 'solid',
        borderTopColor: '#171717',
        borderBottomWidth: `${scale/10}px`,
        borderBottomStyle: 'solid',
        borderBottomColor: '#171717',
        borderLeftWidth: `${scale/10}px`,
        borderLeftStyle: 'solid',
        borderLeftColor: '#171717',
        borderRightWidth: `${scale/10}px`,
        borderRightStyle: 'solid',
        borderRightColor: '#171717'
    }    
}