import React from 'react';
export function FormWarning (props: {formWarning: string}) {
    if (props.formWarning) {
    return (
     <>
     <p className="red">{props.formWarning}</p>
     </>
    )
    } else {
      return null
    }
   }