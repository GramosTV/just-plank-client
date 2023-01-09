import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormWarning } from "./FormWarning";
import ReCAPTCHA from "react-google-recaptcha";
import { LogoutBtn } from "../elements/LogoutBtn";
import { ResendEmailVerification } from "../elements/ResendEmailVerification";
import { Loading } from "../elements/Loading";
import { ParticlesBgc } from "../elements/ParticlesBgc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  cbx: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function RegisterForm(props: any) {
  const [email, setEmail] = useState("");
  const [formWarning, setFormWarning] = useState(["", "", ""]);
  const [formError, setFormError] = useState("");
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const particlesRef = useRef(false);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        if (json.status && json.user.emailVerified === 0) {
          if (isSubscribed) {
                setLoading(false)
              }
          navigate('/login');
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
  const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.elements.name.value;
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    const cbx = e.currentTarget.elements.cbx.checked
    if (!cbx) {
      setFormError("You have to accept accept our Terms of Service and Privacy Policy");
      return;
    }
    setFormLoading(true);
    const reCaptchaToken = await reCaptchaRef.current?.executeAsync();
    if (reCaptchaRef.current) {
      reCaptchaRef.current.reset();
    } else {
      setFormLoading(false)
      throw new Error("reCaptcha is null");
    }
    fetch("/api/addUser", {
      method: "POST",
      body: JSON.stringify({
        name,
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
      .then(function (myJson) {
        if (myJson.error) {
          setFormError(myJson.error);
        } else {
          setFormError("");
        }
        if (myJson.status) {
          setEmail(email);
          setEmailVerification(true);
        }
        setFormLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setFormLoading(false);
      });
  };
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const inputLengthCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    [
      ["name", 2, 25],
      ["email", 2, 254],
      ["password", 5, 60],
    ].map((i, index) => {
      if (e.currentTarget.name === i[0]) {
        e.currentTarget.value.length <= i[1] ||
        e.currentTarget.value.length > i[2]
          ? (function () {
              e.currentTarget.classList.add("redBorder");
              let newArr = [...formWarning];
              newArr[index] = `${capitalizeFirstLetter(i[0])} is too ${
                e.currentTarget.value.length <= i[1] ? "short" : "long"
              }`;
              setFormWarning(newArr);
            })()
          : (function () {
              e.currentTarget.classList.remove("redBorder");
              let newArr = [...formWarning];
              newArr[index] = ``;
              setFormWarning(newArr);
            })();
        if (e.currentTarget.value.length === 0) {
          e.currentTarget.classList.remove("redBorder");
          let newArr = [...formWarning];
          newArr[index] = ``;
          setFormWarning(newArr);
        }
      }

      return i;
    });
  };
  if (loading) return <div className="fill"><Loading /></div>
  return emailVerification ? (
    <>
    <div className="formContainer">
      <ParticlesBgc particlesRef={true}></ParticlesBgc>
      <div className="form">
        <span className='formSpanMargin'>
          We've sent you an email with a link to verify your email.
          <br />
          Please check your email and the spam folder.
          <br />
          If you have verified your email you can head to the
          <p className='heading' onClick={() => navigate('/login')}>
            <b className="pointer">Login Page</b>
          </p>
          <br />
        </span>
        <ResendEmailVerification props={email}></ResendEmailVerification>
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
      <ParticlesBgc particlesRef={true}></ParticlesBgc>
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">Welcome</div>
        <div className="subtitle">Register</div>
        <div className="input-container ic2">
          <input
            id="name"
            className="input"
            type="text"
            placeholder=" "
            name="name"
            minLength={3}
            maxLength={25}
            onChange={inputLengthCheck}
            required
          />
          <div className="cut cut-short" />
          <label htmlFor="name" className="placeholder">
            Name
          </label>
        </div>
        <FormWarning formWarning={formWarning[0]}></FormWarning>
        <div className="input-container ic2">
          <input
            id="email"
            className="input"
            type="email"
            placeholder=" "
            name="email"
            minLength={3}
            maxLength={254}
            onChange={inputLengthCheck}
            required
          />
          <div className="cut cut-short" />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>
        <FormWarning formWarning={formWarning[1]}></FormWarning>
        <div className="input-container ic1">
          <input
            id="password"
            className="input"
            type="password"
            placeholder=" "
            name="password"
            minLength={6}
            maxLength={60}
            onChange={inputLengthCheck}
            required
          />
          <div className="cut" />
          <label htmlFor="password" className="placeholder">
            Password
          </label>
        </div>
        
        <label htmlFor="(cbx)" id='cbxLabel'>
        <div id="cbxContainer">
        <div className="cbx">
          <input id="cbx" type="checkbox" />
          <label>
          </label>
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M2 8.36364L6.23077 12L13 2"></path>
          </svg>
        </div>
        </div>
        You agree to the <strong onClick={() => navigate("/termsOfService")}>Terms of Service</strong> and <strong onClick={() => navigate("/privacyPolicy")}>Privacy Policy</strong>
        </label>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display: 'none'}}>
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4"
                result="blur"
              ></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo"></feBlend>
            </filter>
          </defs>
        </svg>

        <FormWarning formWarning={formWarning[2]}></FormWarning>
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
        <span>
          Do you already have an account? Click{" "}
          <p className="link" onClick={() => navigate('/login')}>
            Login
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
      </form>
      </div>
    </>
  );
}
