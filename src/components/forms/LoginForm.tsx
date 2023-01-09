import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";
import { LogoutBtn } from "../elements/LogoutBtn";
import { ResendEmailVerification } from "../elements/ResendEmailVerification";
import { FormWarning } from "./FormWarning";
import signInWithGoogleImg from "../../img/google/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png";
import { signInWithGoogle } from "../../utils/Firebase";
import ReCAPTCHA from "react-google-recaptcha";
import { Loading } from "../elements/Loading";
import { ParticlesBgc } from "../elements/ParticlesBgc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function LoginForm(props: any) {
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [recoverPassword, setRecoverPassword] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    id: "",
    email: "",
    password: "",
    name: "",
    unit: 0,
    dateOfBirth: "",
    gender: 0,
    height: 0,
    weight: 0,
    statsSet: 0,
    emailVerified: 0,
    isGoogleAccount: 0,
    profile: 0,
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const particlesRef = useRef(false);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        console.log(json);
        if (json.status && json.user.emailVerified === 0) {
          if (isSubscribed) {
            particlesRef.current = true
                setLoading(false)
                setEmailVerification(true);
                setUser(json.user);
              }
        } else if (json.status && json.user.statsSet === 0) {
          if (isSubscribed) {
                setLoading(false)
              }
          navigate("/stats");
        } else if (json.status) {
          if (isSubscribed) {
                setLoading(false)
              }
          navigate('/days');
        } else {
          if (isSubscribed) {
            particlesRef.current = true
                setLoading(false)
              }
          return;
        }
      } catch (e) {
        if (isSubscribed) {
          particlesRef.current = true
          setLoading(false)
              }
        console.error(e);
      }
    }
    fetchUser();
    return () => {
      isSubscribed = false;
    };
  }, [navigate]);
  const [formError, setFormError] = useState("");
  const [passwordRecoveryMessage, setPasswordRecoveryMessage] = useState([false, '']);
  const [passwordRecoveryLoading, setPasswordRecoveryLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    const reCaptchaToken = await reCaptchaRef.current?.executeAsync();
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        reCaptchaToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(async function (myJson) {
        if (myJson.error) {
          setFormError(myJson.error);
        } else {
          setFormError("");
        }
        if (myJson.status) {
          try {
            const response = await fetch(`/api/user`);
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              setEmailVerification(true);
              setUser(json.user);
            } else if (json.status && json.user.statsSet === 0) {
              navigate("/stats");
            } else {
              navigate('/days');
            }
          } catch (e) {
            console.error(e);
            setFormLoading(false);
          }
        }
        setFormLoading(false);
      })
      .catch((e) => {
        setFormError(e);
        console.error(e);
      });
  };
  const handlePasswordRecoverySubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    setPasswordRecoveryLoading(true)
    const email = e.currentTarget.elements.email.value;
    const reCaptchaToken = await reCaptchaRef.current?.executeAsync();
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        email,
        reCaptchaToken,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => response.json())
    .then(res => {setPasswordRecoveryMessage([res.status, res.message]); setPasswordRecoveryLoading(false)})
    .catch(err => {setPasswordRecoveryMessage([false, 'Something went wrong! Please try again']); setPasswordRecoveryLoading(false)})
    
  };
  const handleSignInWithGoogle = async () => {
    const googleAccessToken: any = await signInWithGoogle();
    if (googleAccessToken) {
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          googleJWT: googleAccessToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(async function (myJson) {
          if (myJson.error) {
            setFormError(myJson.error);
          } else {
            setFormError("");
          }
          if (myJson.status) {
            try {
              const response = await fetch(`/api/user`);
              const json = await response.json();
              if (json.status && json.user.emailVerified === 0) {
                setEmailVerification(true);
                setUser(json.user);
              } else if (json.status && json.user.statsSet === 0) {
                navigate("/stats");
              } else {
                navigate('/days');
              }
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch((e) => setFormError(e));
    }
  };
  if (loading) return <div className="fill"><Loading /></div>
  if (passwordRecoveryMessage[0] && passwordRecoveryMessage[1] && recoverPassword) {return(<div className="formContainer"><ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc><div className='form'>
    <div className="goBack animate__animated animate__backInLeft"><strong className='pointer' onClick={() => setRecoverPassword(false)}><FontAwesomeIcon icon={faArrowLeft}/> Login</strong></div>
    <p>{passwordRecoveryMessage[1]}</p></div></div>)}
  if (recoverPassword) return (<>
  <div className="formContainer">
    <ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc>
      <form className="form" onSubmit={handlePasswordRecoverySubmit}>
      <div className="goBack animate__animated animate__backInLeft"><strong className='pointer' onClick={() => setRecoverPassword(false)}><FontAwesomeIcon icon={faArrowLeft}/> Login</strong></div>
      <ReCAPTCHA
          sitekey={
            process.env.REACT_APP_RECAPTCHA_SITE_KEY
              ? process.env.REACT_APP_RECAPTCHA_SITE_KEY
              : ""
          }
          size="invisible"
          ref={reCaptchaRef}
        />
      <div className="title">Password recovery</div>
        <div className="subtitle">Enter your email</div>
      <div className="input-container ic2">
          <input
            id="email"
            className="input"
            type="email"
            placeholder=" "
            name="email"
            minLength={3}
            maxLength={254}
            required
          />
          <div className="cut cut-short" />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>
        {!passwordRecoveryMessage[0] &&passwordRecoveryMessage[1] && recoverPassword ?
      <FormWarning formWarning={typeof passwordRecoveryMessage[1] === 'string' ? passwordRecoveryMessage[1] : ''}></FormWarning> : null}
        {passwordRecoveryLoading ? 
        <button type="submit" className="submit disabled">
        <Loading />
        </button>
        : <button type="submit" className="submit">
        Submit
        </button>}
      </form>
      </div>
  </>)
  return emailVerification ? (
    <>
    <div className="formContainer">
    <ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc>
      <div className="form">
        <span className='formSpanMargin'>
          We've sent you an email with a link to verify your email.
          <br />
          Please check your email and the spam folder.
          <br />
          If you have verified your email you can head to the
          <p className='heading' onClick={() => navigate('/days')}>
            <b className="pointer">App</b>
          </p>
        </span>
        <br />
        <ResendEmailVerification props={user.email}></ResendEmailVerification>
        <br />
        <LogoutBtn props={setEmailVerification}></LogoutBtn>
      </div>
      </div>
    </>
  ) : (
    <>
    <div className="mainPageNav">
    <span onClick={() => navigate('/')}>
      <FontAwesomeIcon icon={faArrowLeft}/>
            <b className="pointer"> Main Page</b>
    </span>
    </div>
    <div className="formContainer">
      <ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc>
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">Welcome</div>
        <div className="subtitle">Login</div>
        <div className="input-container ic2">
          <input
            id="email"
            className="input"
            type="email"
            placeholder=" "
            name="email"
            minLength={3}
            maxLength={254}
            required
          />
          <div className="cut cut-short" />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>
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
        <span>
          Forgot your password? Click{" "}
          <p className="link" onClick={() => setRecoverPassword(true)}>
            Here
          </p>
        </span>
        <span>
          Do you want to create a new account? Click{" "}
          <p className="link" onClick={() => navigate("/register")}>
            Register
          </p>
        </span>
        {formLoading ? (
          <button type="submit" className="submit disabled">
            <Loading />
          </button>
        ) : (
          <button type="submit" className="submit">
            Submit
          </button>
        )}

        <FormWarning formWarning={formError}></FormWarning>
        <ReCAPTCHA
          sitekey={
            process.env.REACT_APP_RECAPTCHA_SITE_KEY
              ? process.env.REACT_APP_RECAPTCHA_SITE_KEY
              : ""
          }
          size="invisible"
          ref={reCaptchaRef}
        />
        <img
          onClick={handleSignInWithGoogle}
          src={signInWithGoogleImg}
          alt="Sign in with Google"
          className="pointer"
        />
        <label htmlFor="(cbx)" id="cbxLabel">
          By Signing in you agree to the{" "}
          <strong onClick={() => navigate("/termsOfService")}>
            Terms of Service
          </strong>{" "}
          and{" "}
          <strong onClick={() => navigate("/privacyPolicy")}>
            Privacy Policy
          </strong>
        </label>
      </form>
      </div>
    </>
  );
}
