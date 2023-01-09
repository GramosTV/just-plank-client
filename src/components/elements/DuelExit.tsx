import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
  export function DuelExit(props: any) {
      console.log('ye')
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/duel')
    })
    return null
    
}