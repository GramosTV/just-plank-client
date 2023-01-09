import { json } from 'node:stream/consumers';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
export function ResendEmailVerification(props: any) {
const [sendStatus, setSendStatus] = useState<boolean>(false);
const [sendMessage, setSendMessage] = useState<string>('');
const reCaptchaRef = useRef<ReCAPTCHA>(null);
const handleSendEmailVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
  const reCaptchaToken = await reCaptchaRef.current?.executeAsync();
    if (reCaptchaRef.current) {
      reCaptchaRef.current.reset();
    }
        fetch('/api/emailVerification',
          {
            method: "POST",
            body: JSON.stringify({
            email: props.props,
            reCaptchaToken
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        ).then((data) => data.json()).then((data) => {
            if(data.status) {
                setSendMessage('Message sent successfully, please check your email and the spam folder');
                setSendStatus(true);
            } else {
                setSendMessage(data.message);
                setSendStatus(true);
            }   
        })
      }
    return sendStatus ? <p>{sendMessage}</p> : <><ReCAPTCHA
    sitekey={
      process.env.REACT_APP_RECAPTCHA_SITE_KEY
        ? process.env.REACT_APP_RECAPTCHA_SITE_KEY
        : ""
    }
    size="invisible"
    ref={reCaptchaRef}
  />
  <button className='btn' onClick={handleSendEmailVerification}>Resend Email</button>
  </>
}