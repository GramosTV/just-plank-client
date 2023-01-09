import React from 'react'

export function AvatarBox({body, eye, face, hat} : any) {
  return (
    <div className="avatar">
        <img className='body' src={`/img/avatar/bodies/${body}-min.png`} alt="Plank avatar body" />
        <img className='face' src={`/img/avatar/faces/${face}-min.png`} alt="Plank avatar face" />
        <img className='hat' src={`/img/avatar/hats/${hat}-min.png`} alt="Plank avatar hat" />
        <img className='eye' src={`/img/avatar/eyes/${eye}-min.png`} alt="Plank avatar eye" />
    </div>
  )
}

