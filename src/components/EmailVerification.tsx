import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loading } from './elements/Loading';
import { ParticlesBgc } from './elements/ParticlesBgc'

export function EmailVerification() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const emailCode = searchParams.get('emailCode');
    const [emailMessage, setEmailMessage] = useState('')
    useEffect(() => {
        const emailVerification = async () => {
            const res = await (await fetch(`/api/emailVerification/${emailCode}`)).json()
        if(emailCode) {
            setEmailMessage(res.message)
        } else {
            setEmailMessage('This email verification code is invalid. You can resend the email verification token on the ')
        }
    }
    emailVerification()
    }, [emailCode]);
  return (
      <>
    <div className="formContainer">
    <ParticlesBgc particlesRef={true}></ParticlesBgc>
    <div className="form">
        {emailMessage ? <div>{emailMessage} <strong className="pointer" onClick={() => navigate('/login')}>login page</strong></div> : <Loading></Loading>}
        
    </div>
    </div>
    </>
  )
}
