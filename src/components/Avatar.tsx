import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { User } from '../interfaces/user';
import { AvatarBox } from './elements/AvatarBox'
import { Loading } from './elements/Loading';
interface FormElements extends HTMLFormControlsCollection {
  newName: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}
export function Avatar() {
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
        profile: 0
      });

    const bodies = useRef<number[]>([0,1,2,3,4]);
    const eyes = useRef<number[]>([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    const faces = useRef<number[]>([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    const hats = useRef<number[]>([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);

    const usedBody = useRef<number>(0);
    const usedEye = useRef<number>(0);
    const usedFace = useRef<number>(0);
    const usedHat = useRef<number>(0);

    const [body, setBody] = useState(0)
    const [eye, setEye] = useState(0)
    const [face, setFace] = useState(0)
    const [hat, setHat] = useState(0)
    
    const [newName, setNewName] = useState('')
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [changer, setChanger] = useState(0)
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    useEffect(() => {
        let isSubscribed = true;
        async function fetchUser() {
          try {
            const response = await fetch(`/api/user`);
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              navigate('/login');
            } else if (json.status && json.user.statsSet === 0) {
              navigate("/stats");
            } else if (json.status) {
                const avatar = await (await fetch(`/api/avatar/${json.user.name}`)).json()
                if(avatar.status) {
                    usedBody.current = avatar.avatar.body
                    usedEye.current = avatar.avatar.eye
                    usedFace.current = avatar.avatar.face
                    usedHat.current = avatar.avatar.hat
                    setBody(avatar.avatar.body)
                    setEye(avatar.avatar.eye)
                    setFace(avatar.avatar.face)
                    setHat(avatar.avatar.hat)
                }
              if (isSubscribed) {
                setUser(json.user);
                setLoading(false);
              }
              return;
            } else {
              navigate('/login');
            }
          } catch (e) {
            console.error(e);
            if (isSubscribed) {
              setLoading(false);
            }
          }
        }
        fetchUser();
        return () => {
          isSubscribed = false;
        };
      }, [navigate]);
      const submitAvatar = async (e: MouseEvent<HTMLButtonElement>) => {
        usedBody.current = body
        usedEye.current = eye
        usedFace.current = face
        usedHat.current = hat
        setAvatarLoading(true)
        try {
            const res = await(await fetch('/api/avatar', {
                method: 'PUT',
                body: JSON.stringify({ body, eye, face, hat }),
                headers: {
                "Content-Type": "application/json",
                },
            })).json()
            if(res.status) {
                toast('Avatar successfully updated')
                setAvatarLoading(false)
            } else {
                toast('Failed to update avatar, please try again later')
                setAvatarLoading(false)
            }
        }
        catch (e) {
            toast('Oh no! Unknown error has occurred!')
            setAvatarLoading(false)
        }
      }
    const handleBodyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBody(Number(e.currentTarget.id))
    }
    const handleFaceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFace(Number(e.currentTarget.id))
    }
    const handleHatChange = (e: ChangeEvent<HTMLInputElement>) => {
        setHat(Number(e.currentTarget.id))
    }
    const handleEyeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEye(Number(e.currentTarget.id))
    }
    const handleDuelJoin = async (e: React.FormEvent<YourFormElement>) => {
      e.preventDefault();
      const name = e.currentTarget.elements.newName.value;
      if (name === user.name) {
        toast('You are already using this name')
        return
      }
      const res = await (
        await fetch("/api/userName", {
          method: "PUT",
          body: JSON.stringify({
            name,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (res.status) {
        toast(`Name successfully changed to ${name}`)
        setNewName('')
        setUser(Object.assign(user, {name: name}))
      } else {
        toast(res.message)
      }
    }
    if (loading) return <Loading />;
  return (
      <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="avatarContainer">
      <strong
          className="animate__animated animate__backInLeft navigator"
          onClick={() => navigate("/profile")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Go back
        </strong>
        
          <div className="avatarForm animate__animated animate__backInLeft">
          <AvatarBox body={body} eye={eye} face={face} hat={hat}></AvatarBox>
          <button onClick={(usedBody.current === body &&  usedEye.current === eye && usedFace.current === face && usedHat.current === hat) ? () => null : submitAvatar} className={((usedBody.current === body &&  usedEye.current === eye && usedFace.current === face && usedHat.current === hat) ? 'btn dont' : 'btn') + (avatarLoading ? ' loading' : '')}>{avatarLoading ? <Loading /> : 'Save'}</button>
          <form onSubmit={handleDuelJoin}>
              <h2>Change your username</h2>
              <div>
              <input
                placeholder="New username"
                type="text"
                name="newName"
                id="newName"
                maxLength={25}
                minLength={3}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button type="submit">Confirm</button>
              </div>
            </form>
          </div>
          <div className="selectContainer animate__animated animate__backInRight">
      {changer === 0 ? <div className="select-sim" id="0">
        <div className="heading">
          <div className="btns">
          <button className='active' onClick={() => null}>Body</button>
          <button onClick={() => setChanger(1)}>Eyes</button>
          <button onClick={() => setChanger(2)}>Face</button>
          <button onClick={() => setChanger(3)}>Hat</button></div>
          </div>
  <div className="options scrollMobile">
    {bodies.current.map((e, i) => {
        return (
        <div key={e} className="option">
      <input type="radio" name="color" value="red" id={String(i)} onChange={handleBodyChange} checked={body === i}/>
      <label htmlFor="color-red">
        <img src={`/img/avatar/bodies/${i}-min.png`} alt="" />
      </label>
    </div>)
    })}
  </div>
</div> : null}
{changer === 1 ? <div className="select-sim" id="2">
<div className="heading">
          <div className="btns">
          <button onClick={() => setChanger(0)}>Body</button>
          <button className='active' onClick={() => null}>Eyes</button>
          <button onClick={() => setChanger(2)}>Face</button>
          <button onClick={() => setChanger(3)}>Hat</button></div>
          </div>
  <div className="options scrollMobile">
    {eyes.current.map((e, i) => {
        return (
        <div key={e} className="option">
      <input type="radio" name="2" value="2" id={String(i)} onChange={handleEyeChange} checked={eye === i}/>
      <label htmlFor="2">
        <img src={`/img/avatar/eyes/${i}-min.png`} alt="" />
      </label>
    </div>)
    })}
  </div>
</div> : null} 
{changer === 2 ? <div className="select-sim" id="0">
<div className="heading">
          <div className="btns">
          <button onClick={() => setChanger(0)}>Body</button>
          <button onClick={() => setChanger(1)}>Eyes</button>
          <button className='active' onClick={() => null}>Face</button>
          <button onClick={() => setChanger(3)}>Hat</button></div>
          </div>
  <div className="options scrollMobile">
    {faces.current.map((e, i) => {
        return (
        <div key={e} className="option">
      <input type="radio" name="0" value="0" id={String(i)} onChange={handleFaceChange} checked={face === i}/>
      <label htmlFor="0">
        <img src={`/img/avatar/faces/${i}-min.png`} alt="" />
      </label>
    </div>)
    })}
  </div>
</div> : null}
{changer === 3 ? <div className="select-sim hat" id="1">
<div className="heading">
          <div className="btns">
          <button onClick={() => setChanger(0)}>Body</button>
          <button onClick={() => setChanger(1)}>Eyes</button>
          <button onClick={() => setChanger(2)}>Face</button>
          <button className='active' onClick={() => null}>Hat</button></div>
          </div>
  <div className="options scrollMobile">
    {hats.current.map((e, i) => {
        return (
        <div key={e} className="option">
      <input type="radio" name="1" value="1" id={String(i)} onChange={handleHatChange} checked={hat === i}/>
      <label htmlFor="1">
        <img src={`/img/avatar/hats/${i}-min.png`} alt="" />
      </label>
    </div>)
    })}
  </div>
</div> : null}
</div>
</div>
</>
  )
}

