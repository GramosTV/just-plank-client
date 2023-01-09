import React from 'react'
export function ProfileTime(props: any) {
    const num = props.props
    return <p>{` ${String(num).slice(0, 2) !== '00' ? 
    Number(String(num).slice(0, 2)) + 
    ` hour${Number(String(num).slice(0, 2)) > 1 ? 's' : ''}` : ''}
    ${String(num).slice(2, 4) !== '00' ? 
    Number(String(num).slice(2, 4)) + 
    ` minute${Number(String(num).slice(2, 4)) > 1 ? 's' : ''}` : ''}  
    ${String(num).slice(4, 6) !== '00' ? 
    Number(String(num).slice(4, 6)) + 
    ` second${Number(String(num).slice(4, 6)) > 1 ? 's' : ''}` : ''}`}</p>
}




