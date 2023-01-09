import React, { useEffect, useState } from 'react';
  export function BMI(props: any) {
    const [bmi, setBmi] = useState<number>(0)
    const [bmiString, setBmiString] = useState<string>('')
    const [bmiColor, setBmiColor] = useState<string>('')
    useEffect(() => {
        const {weight, height} = props.props
        setBmi(Math.floor(weight/((height/100)*(height/100))))
        if (bmi < 18.5) {
           setBmiString('Underweight')
           setBmiColor('royalblue')
        } else if (bmi < 25) {
           setBmiString('Normal weight')
           setBmiColor('green')
        } else if (bmi < 30) {
           setBmiString('Overweight')
           setBmiColor('orange')
        } else {
           setBmiString('Obese')
           setBmiColor('red')
        }
    }, [bmi, props.props])
    return <span>BMI score: {bmi} (<p style={{color: bmiColor, display: 'inline'}}>{bmiString}</p>)</span>
    
}