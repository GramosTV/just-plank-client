import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces/user";
import { BMI } from "./elements/BMI";
import { Loading } from "./elements/Loading";
import { ProfileTime } from "./elements/ProfileTime";
import { MainBox } from "./MainBox";
import { UI } from "./UI";
//@ts-ignore
import TripleToggleSwitch from 'react-triple-toggle-switch';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faLock, faLockOpen, faShareFromSquare, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { ProfileStatus } from "../enums/profileStatus";
import { toast, ToastContainer } from "react-toastify";
import { AvatarBox } from "./elements/AvatarBox";

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number | string;
  totalCaloriesBurnt: number;
  totalPlankTime: number | string;
  dayStreak: number;
}

export function Profile(props: any) {
  const [user, setUser] = useState<ProfileStats>({
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
    totalDays: 0,
    totalPlanks: 0,
    bestPlankTime: 0,
    totalCaloriesBurnt: 0,
    totalPlankTime: 0,
    dayStreak: 0,
    profile: 0,
  });
  const profileCheckbox = useRef<boolean[]>([false, false, false])
  const [profileStatusCheckbox, setProfileStatusCheckbox] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true);
  const body = useRef(0)
  const eye = useRef(0)
  const face = useRef(0)
  const hat = useRef(0)
  const navigate = useNavigate();
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        let arr = [...profileCheckbox.current] 
        arr[json.user.profile] = true
        profileCheckbox.current = arr
        setProfileStatusCheckbox(json.user.profile);
        if (json.status && json.user.emailVerified === 0) {
          navigate('/login');
        } else if (json.status && json.user.statsSet === 0) {
          navigate("/stats");
        } else if (json.status) {
          const userStats = await fetch(`/api/profile`);
          let avatar = await (await fetch(`/api/avatar/${json.user.name}`)).json()
          if (!avatar.status) {
            avatar.avatar = {
              body: 0,
              eye: 0,
              face: 0,
              hat: 0
           }
          }
          body.current = avatar.avatar.body
          eye.current = avatar.avatar.eye
          face.current = avatar.avatar.face
          hat.current = avatar.avatar.hat
          let stats = await userStats.json();
          stats.stats.bestPlankTime = Number(
            new Date(stats.stats.bestPlankTime * 1000)
              .toISOString()
              .substring(11, 19)
              .replace(/\:/g, "")
          );
          stats.stats.totalPlankTime = Number(
            new Date(stats.stats.totalPlankTime * 1000)
              .toISOString()
              .substring(11, 19)
              .replace(/\:/g, "")
          );
          stats.stats.bestPlankTime = String(
            stats.stats.bestPlankTime
          ).padStart(6, "0");
          stats.stats.totalPlankTime = String(
            stats.stats.totalPlankTime
          ).padStart(6, "0");
          console.log(Math.trunc(json.user.weight * 100) / 100);
          if (isSubscribed) {
            setUser(Object.assign(json.user, stats.stats));
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
  function getAge(birthday: Date) {
    var today = new Date();
    var thisYear = 0;
    if (today.getMonth() < birthday.getMonth()) {
      thisYear = 1;
    } else if (
      today.getMonth() === birthday.getMonth() &&
      today.getDate() < birthday.getDate()
    ) {
      thisYear = 1;
    }
    var age = today.getFullYear() - birthday.getFullYear() - thisYear;
    return age;
  }
  const handleProfileChange = (e: any) => {
    const id = Number(e.currentTarget.id)
    if (!profileCheckbox.current[id]) {
      let arr = [false, false, false]
      arr[id] = true
      profileCheckbox.current = arr
      setProfileStatusCheckbox(id)
      fetch(`/api/profile`, {
        method: 'PUT',
        body: JSON.stringify({profileStatus: id}),
        headers: {
          "Content-Type": "application/json",
        }
      })
    }
  }
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  };
  
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
      <div className="profile">
        <div className="user">
          <div onClick={() => navigate('/profile/avatar')}className="edit"><FontAwesomeIcon icon={faEdit}/></div>
          <h3>{user.name}</h3>
          <AvatarBox body={body.current} eye={eye.current} face={face.current} hat={hat.current} />
          {/* <p>{user.gender ? "Female" : "Male"}</p> */}
          <p>Age: {getAge(new Date(user.dateOfBirth))}</p>
          <p>
            Height:{" "}
            {user.unit
              ? Math.trunc((user.height / 2.54) * 100) / 100 + " in"
              : Math.trunc(user.height * 100) / 100 + " cm"}
          </p>
          <p>
            Weight:{" "}
            {user.unit
              ? Math.trunc(user.weight * 2.20462262 * 100) / 100 + " lbs"
              : Math.trunc(user.weight * 100) / 100 + " kg"}
          </p>
          <BMI props={{ weight: user.weight, height: user.height }} />
          {user.dayStreak > 1 ? (
            <>
              <div className="fire">
                <div className="flames">
                  <div className="dayStreak">{user.dayStreak}</div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
              </div>
              <h2>Day{user.dayStreak > 1 ? "s" : null} streak</h2>
            </>
          ) : (
            <h2 className="dayStreakH2Margin">
              {user.dayStreak === 0
                ? null
                : `${user.dayStreak} Day${
                    user.dayStreak > 1 ? "s" : ""
                  } streak`}
            </h2>
          )}
        </div>
        <div className="stats">
          <div className="profileStatus animate__animated animate__backInDown animationDisabledForMobile">
            <div className='frameContainer'>
            <div className="frame">
            <div className="center">
          <div className="checkbox">
          <input type="checkbox" className="check" id='0' checked={profileCheckbox.current[0]}/><label id='0' onClick={handleProfileChange} htmlFor="check"><FontAwesomeIcon icon={faLock}/></label>
          </div>
          
          </div></div>
          <div className="frame">
            <div className="center">
          <div className="checkbox">
          <input  type="checkbox" className="check" id='1' checked={profileCheckbox.current[1]}/><label id='1' onClick={handleProfileChange} htmlFor="check"><FontAwesomeIcon icon={faUserGroup}/></label></div>
          </div></div>
          <div className="frame">
            <div className="center">
          <div className="checkbox">
          <input type="checkbox" className="check" id='2' checked={profileCheckbox.current[2]}/><label id='2' onClick={handleProfileChange} htmlFor="check"><FontAwesomeIcon icon={faLockOpen}/></label></div>
          </div></div>
          </div>
          <span>
          {profileStatusCheckbox === ProfileStatus.Private ? 'Private' : null}
          {profileStatusCheckbox === ProfileStatus.FriendsOnly ? 'Only friends' : null}
          {profileStatusCheckbox === ProfileStatus.Public ? 'Public' : null}
          </span>
          
          <FontAwesomeIcon onClick={profileStatusCheckbox === ProfileStatus.Private ? () => null : () => {
            copyToClipboard(window.location.href.replace('profile', `userProfile/?userName=${user.name}`).substring(0, window.location.href.replace('profile', `userProfile/?userName=${user.name}`).indexOf(user.name) + user.name.length));
          toast('Link copied to clipboard')}} style={{opacity: profileStatusCheckbox === ProfileStatus.Private ? '0.4' : '1', cursor: profileStatusCheckbox === ProfileStatus.Private ? 'not-allowed' : 'pointer'}} icon={faShareFromSquare}/>
          </div>
          <div
            className="block animate__animated animate__zoomIn"
            style={{ animationDelay: "0s" }}
          >
            <strong>Best Planking Time</strong>
            {user.bestPlankTime === "000000" ? (
              <p>0</p>
            ) : (
              <ProfileTime props={user.bestPlankTime}></ProfileTime>
            )}
          </div>
          <div
            className="block animate__animated animate__zoomIn"
            style={{ animationDelay: ".15s" }}
          >
            <strong>Total calories Burnt</strong>
            <p>{user.totalCaloriesBurnt} kcal</p>
          </div>
          <div
            className="block animate__animated animate__zoomIn"
            style={{ animationDelay: ".3s" }}
          >
            <strong>Total Planking Time</strong>
            {user.totalPlankTime === "000000" ? (
              <p>0</p>
            ) : (
              <ProfileTime props={user.totalPlankTime}></ProfileTime>
            )}
          </div>
          <div
            className="block animate__animated animate__zoomIn"
            style={{ animationDelay: ".45s" }}
          >
            <strong>Total Planks</strong>
            <p>{user.totalPlanks}</p>
          </div>
        </div>
      </div>
    </>
  );
}
