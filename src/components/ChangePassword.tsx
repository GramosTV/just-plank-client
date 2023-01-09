import { faArrowLeft, faPray } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loading } from './elements/Loading';
import { ParticlesBgc } from './elements/ParticlesBgc'
import { FormWarning } from './forms/FormWarning';
interface FormElements extends HTMLFormControlsCollection {
    password: HTMLInputElement;
    againPassword: HTMLInputElement;
  }
  
  interface YourFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }
export function ChangePassword() {
    const [searchParams] = useSearchParams();
    const passwordToken = searchParams.get('passwordToken')
    const [formWarning, setFormWarning] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    useEffect(() => {
        if (!passwordToken) {
        setFormWarning('Invalid password token')
        } else {
            setFormWarning('')
        }
    }, [passwordToken])
    const navigate = useNavigate()
    const [formLoading, setFormLoading] = useState<boolean>(false)
    const [formMessage, setFormMessage] = useState([false, ''])
    const reCaptchaRef = useRef<ReCAPTCHA>(null);
    const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
        e.preventDefault();
        const password = e.currentTarget.elements.password.value;
        const againPassword = e.currentTarget.elements.againPassword.value;
        if(!(password === againPassword)) {
            setFormMessage([false, 'Passwords do not match'])
            return 
        }
        setFormLoading(true);
        const reCaptchaToken = await reCaptchaRef.current?.executeAsync();
        fetch("/api/user", {
          method: "PUT",
          body: JSON.stringify({
            password,
            passwordToken,
            reCaptchaToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(response => response.json())
        .then(res => {
            setFormMessage([res.status, res.message]);
            removeCookie('jwtToken')
            setFormLoading(false);
        })
        .catch((e) => {
            setFormMessage([false, 'Oh no! Something went wrong, please try again']);
            setFormLoading(false);
        });
      };
      if (formWarning) {
        return (<>
        <div className="formContainer">
        <ParticlesBgc particlesRef={true}></ParticlesBgc>
        <div className="form">
            <p>{formWarning}</p>
        </div>
        </div>
        </>)
      }
      if (formMessage[0]) {
          return (
        <div className="formContainer">
        <ParticlesBgc particlesRef={true}></ParticlesBgc>
        <form className="form" onSubmit={handleSubmit}>
        <div className="goBack animate__animated animate__backInLeft"><strong className='pointer' onClick={() => navigate('/login')}><FontAwesomeIcon icon={faArrowLeft}/> Login</strong></div>
          <p>{formMessage[1]}</p>
          </form>
      </div>)
      }
  return (
    <div className="formContainer">
      <ParticlesBgc particlesRef={true}></ParticlesBgc>
      <form className="form" onSubmit={handleSubmit}>
      <div className="goBack animate__animated animate__backInLeft"><strong className='pointer' onClick={() => navigate('/login')}><FontAwesomeIcon icon={faArrowLeft}/> Login</strong></div>
        <div className="title">Password recovery</div>
        <div className="subtitle">Set a new password</div>
        <div className="input-container ic1">
          <input
            id="password"
            className="input"
            type="password"
            placeholder=" "
            minLength={6}
            maxLength={60}
            required
          />
          <div className="cut" />
          <label htmlFor="password" className="placeholder">
            Password
          </label>
        </div>
        <div className="input-container ic1">
          <input
            id="againPassword"
            className="input"
            type="password"
            placeholder=" "
            minLength={6}
            maxLength={60}
            required
          />
          <div className="cut cut-long" />
          <label htmlFor="againPassword" className="placeholder">
            Rewrite password
          </label>
        </div>
        {!formMessage[0] && formMessage[1] ?
      <FormWarning formWarning={typeof formMessage[1] === 'string' ? formMessage[1] : ''}></FormWarning> : null}
        <ReCAPTCHA
          sitekey={
            process.env.REACT_APP_RECAPTCHA_SITE_KEY
              ? process.env.REACT_APP_RECAPTCHA_SITE_KEY
              : ""
          }
          size="invisible"
          ref={reCaptchaRef}
        />
        {formLoading ? (
          <button type="submit" className="submit disabled">
            <Loading />
          </button>
        ) : (
          <button type="submit" className="submit">
            Submit
          </button>
        )}
        </form>
    </div>
  )
}