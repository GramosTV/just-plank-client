import React, {useState, useEffect, useRef, ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom'
import { User } from '../../interfaces/user';
import { Loading } from '../elements/Loading';
import { LogoutBtn } from '../elements/LogoutBtn';
import { ParticlesBgc } from '../elements/ParticlesBgc';
import { ResendEmailVerification } from '../elements/ResendEmailVerification';
import { FormWarning } from './FormWarning'
interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement,
  unitCheckbox: HTMLInputElement,
  dateOfBirth: HTMLInputElement,
  gender: HTMLInputElement,
  height: HTMLInputElement,
  weight: HTMLInputElement,
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

export function StatsForm ({props}: any) {
  const [emailVerification, setEmailVerification] = useState<boolean>(false)
  const [googleAccount, setGoogleAccount] = useState<boolean>(false)
  const email = useRef<string>('')
  const [formWarning, setFormWarning] = useState(['', '', '',''])
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
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
  const particlesRef = useRef(false);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
        try {
            const response = await fetch(`/api/user`);
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              email.current = json.user.email
              if (isSubscribed) {
              particlesRef.current = true
              setLoading(false)
              setEmailVerification(true)
              setUser(json.user);
              }
            } else if(json.status && json.user.statsSet === 0) {
              email.current = json.user.email
              if (json.user.isGoogleAccount) {
                if (isSubscribed) {
                  particlesRef.current = true
                  setLoading(false)
                setGoogleAccount(true)
                }
              }
              if (isSubscribed) {
                particlesRef.current = true
                setLoading(false)
              }
              return
            }
             else if (json.status) {
              if (isSubscribed) {
              setLoading(false)
              }
              navigate('/days')
            } else {
              if (isSubscribed) {
              setLoading(false)
              }
              navigate('/login')
            }
            
        } catch (e) {
          if (isSubscribed) {
            particlesRef.current = true
            setLoading(false)
          }
            console.error(e);
        }
    };
    fetchUser();
    return () => {
      isSubscribed = false;
    };
}, [navigate]);
  const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.elements?.name?.value;
    const unit = e.currentTarget.elements.unitCheckbox.checked
    const dateOfBirth = e.currentTarget.elements.dateOfBirth.value
    const gender = e.currentTarget.elements.gender.checked
    const height = e.currentTarget.elements.height.value
    const weight = e.currentTarget.elements.weight.value
    setFormLoading(true)
    try {
    const setStats = await fetch('/api/setStats',
    {
      method: "PUT",
      body: JSON.stringify({
        name: googleAccount ? name : '',
        unit,
        dateOfBirth,
        gender,
        height: unit ? Math.floor(Number(height) * 2.54) : height,
        weight: unit ? Number(weight) / 2.20462262 : weight,
        email: email.current,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const statsData = await setStats.json()
    if(statsData.status) {
      setFormError('')
      navigate('/days')
      } else {
        setFormError(statsData.error)
      }
      setFormLoading(false)
    }
    catch (e) {
      console.error(e);
      setFormLoading(false);
    }
    
  }
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  const unitInput = useRef<boolean>(false)
  const genderInput = useRef<boolean>(false)
  const heightInput = useRef<HTMLInputElement>(null)
  const weightInput = useRef<HTMLInputElement>(null)
  const [unitLabel, setUnitLabel] = useState<string[]>(['Metric', 'kg', 'cm'])
  const [gender, setGender] = useState<string>('Male')
  const handleUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      unitInput.current = true;
      if(heightInput.current) {heightInput.current.value = Math.round(Number(heightInput.current.value) * 0.393701) +''}
      if(weightInput.current) {weightInput.current.value = Math.round(Number(weightInput.current.value) * 2.20462262 * 100)/100 + ''}
      setUnitLabel(['Imperial', 'lbs', 'in']);
    } else {
      unitInput.current = false;
      if(heightInput.current) {heightInput.current.value = Math.round(Number(heightInput.current.value) * 2.54) + ''}
      if(weightInput.current) {weightInput.current.value = Math.round(Number(weightInput.current.value) / 2.20462262 * 100)/100 + ''}
      setUnitLabel(['Metric', 'kg', 'cm']); 
    }
    if(heightInput.current) { 
    if(Number(heightInput.current.value) > 250 && !unitInput.current) {
      let newArr = [...formWarning]; 
      newArr[1]=`You're too tall`; 
      setFormWarning(newArr)
    } else if (Number(heightInput.current.value) > 98 && unitInput.current) {
      let newArr = [...formWarning]; 
      newArr[1]=`You're too tall`; 
      setFormWarning(newArr)
    } else {
      let newArr = [...formWarning]; 
      newArr[1]=``; 
      setFormWarning(newArr) 
      }
    }
    if(weightInput.current) { 
      if(Number(weightInput.current.value) > 450 && !unitInput.current) {
        let newArr = [...formWarning]; 
        newArr[2]=`You're too heavy`; 
        setFormWarning(newArr)
      } else if (Number(weightInput.current.value) > 992 && unitInput.current) {
        let newArr = [...formWarning]; 
        newArr[2]=`You're too heavy`; 
        setFormWarning(newArr)
      } else {
        let newArr = [...formWarning]; 
        newArr[2]=``; 
        setFormWarning(newArr)
      }
    }
  }
  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      genderInput.current = true;
      setGender('Female');
    } else {
      genderInput.current = false;
      setGender('Male'); 
    }
  }
  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
      if(String(e.target.value).substring(String(e.target.value).indexOf(".")).length > 3 ) {
      let newArr = [...formWarning]; 
      newArr[2]=`Enter only 2 numbers after the decimal point`; 
      setFormWarning(newArr)
      return;
      }
      if(Number(e.target.value) > 450 && !unitInput.current) {
        let newArr = [...formWarning]; 
        newArr[2]=`You're too heavy`; 
        setFormWarning(newArr)
      } else if (Number(e.target.value) > 992 && unitInput.current) {
        let newArr = [...formWarning]; 
        newArr[2]=`You're too heavy`; 
        setFormWarning(newArr)
      } else {
        let newArr = [...formWarning]; 
        newArr[2]=``; 
        setFormWarning(newArr)
    }
  }
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(Number(e.target.value) > 250 && !unitInput.current) {
      let newArr = [...formWarning]; 
      newArr[1]=`You're too tall`; 
      setFormWarning(newArr)
    } else if (Number(e.target.value) > 98 && unitInput.current) {
      let newArr = [...formWarning]; 
      newArr[1]=`You're too tall`; 
      setFormWarning(newArr)
    } else {
      let newArr = [...formWarning]; 
      newArr[1]=``; 
      setFormWarning(newArr)
    }
  }
  const inputLengthCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    [['name', 2, 25]].map(i => {
       if (e.currentTarget.name === i[0]) {
         e.currentTarget.value.length <= i[1] || e.currentTarget.value.length > i[2]
         ? function() {
           e.currentTarget.classList.add('redBorder');
            let newArr = [...formWarning]; 
            newArr[3]=`${capitalizeFirstLetter(i[0])} is too ${e.currentTarget.value.length <= i[1] ? 'short' : 'long'}`; 
            setFormWarning(newArr)
         }()
         : function() {e.currentTarget.classList.remove('redBorder'); let newArr = [...formWarning]; newArr[3]=``; setFormWarning(newArr)}()
         if (e.currentTarget.value.length === 0) {
           e.currentTarget.classList.remove('redBorder'); 
           let newArr = [...formWarning]; newArr[3]=``;
           setFormWarning(newArr)
       }
       }
       
       return i
    })
   } 
   if (loading) return <div className="fill"><Loading /></div>
  return emailVerification ? <>
  <div className="formContainer">
      <ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc>
  <div className="form stats">
  <span className='formSpanMargin'>
      We've sent you an email with a link to verify your email.
      <br />
       Please check your email and the spam folder.
      <br />
      If you have verified your email you can head to the <p className='heading' onClick={() => navigate('/days')}>
         <b className="pointer">App</b>
        <br />
    </p>
    </span>
    <ResendEmailVerification props={user.email}></ResendEmailVerification>
    <br />
    <LogoutBtn props={setEmailVerification}></LogoutBtn>
  </div>
  </div>
  </> : <>
  <div className="formContainer">
    <ParticlesBgc particlesRef={particlesRef.current}></ParticlesBgc>
    <form className="form stats" onSubmit={handleSubmit}>
      <div className="title">One more thing</div>
      <div className="subtitle">Enter your data to begin</div>
      {googleAccount ? <div className="input-container ic2">
        <input id="name" className="input" type="text" placeholder=" " name='name' minLength={3} maxLength={25} onChange={inputLengthCheck} required/>
          <div className="cut cut-short" />
          <label htmlFor="name" className="placeholder">Name
          </label></div> : null}
      
      <div className="md-switch md">
      <span>Choose your measurement system</span>
        <input onChange={handleUnitChange} type="checkbox" id="unitCheckbox" name="unitCheckbox" className="md-toggle md-toggle-round"/>
        <label htmlFor="unitCheckbox"><span className='switch small'>{unitLabel[0]}</span></label>
      </div>
        <div className="input-container ic2">
        <input id="dateOfBirth" className="input" type="date" placeholder=" " name='dateOfBirth' min={new Date(new Date().setFullYear(new Date().getFullYear() - 135)).toISOString().split('T')[0]} max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]} required/>
        <div className="cut cut" />
        <label htmlFor="dateOfBirth" className="placeholder">Birth date
        </label></div>
        <div className="md-switch">
        <span>Select your gender</span>
        <input onChange={handleGenderChange} type="checkbox" id="gender" name="gender" className="md-toggle md-toggle-round genderInput"/>
        <label htmlFor="gender"><span className='switch'>{gender}</span></label>
        </div>
          <FormWarning formWarning={formWarning[0]}></FormWarning>
          <div className="input-container ic2 numberSmall">
        <input ref={heightInput} id="height" className="input" type="number" placeholder=" " name='height' min={1} max={unitInput.current ?  98 : 250} onChange={handleHeightChange} required/>
          <div className="cut cut" />
          <label htmlFor="height" className="placeholder">Height({unitLabel[2]})
          </label></div>
          <FormWarning formWarning={formWarning[1]}></FormWarning>
        <div className="input-container ic2 numberSmall">
        <input ref={weightInput} id="weight" className="input" type="number" placeholder=" " name='weight' step=".01" min={1} max={unitInput.current ?  992 : 450} onChange={handleWeightChange} required/>
          <div className="cut cut" />
          <label htmlFor="weight" className="placeholder">Weight({unitLabel[1]})
          </label></div>
          <FormWarning formWarning={formWarning[2]}></FormWarning>
        <FormWarning formWarning={formError}></FormWarning>
        {formLoading ? 
        <button type="submit" className='submit disabled'><Loading/></button>
        : <button type="submit" className='submit'>Submit</button>}
      </form>
      </div>
    </>
}