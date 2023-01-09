import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "../interfaces/user";
import { AvatarBox } from "./elements/AvatarBox";
import { BMI } from "./elements/BMI";
import { Loading } from "./elements/Loading";
import { ProfileTime } from "./elements/ProfileTime";
import { MainBox } from "./MainBox";
import { UI } from "./UI";

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number | string;
  totalCaloriesBurnt: number;
  totalPlankTime: number | string;
  dayStreak: number;
}

export function UserProfile(props: any) {
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
    profile: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<(boolean | string)[]>([false, false, '']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [avatar, setAvatar] = useState<any>('')
  const username = searchParams.get('userName');
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        if(!username) {
            if (isSubscribed) {
                setStatus([false, json.status, 'This username is invalid'])
                setLoading(false);
              }
            return
        }
        if(String(username).length < 3 || String(username).length > 25) {
            if (isSubscribed) {
                setStatus([false, json.status, 'This username is invalid'])
                setLoading(false);
            }
            return
        }
        const userStats = await fetch(`/api/userProfile/${username}`);
        let stats = await userStats.json();
        const avatarSave = await (await fetch(`/api/avatar/${stats.stats.name}`)).json()
        if (isSubscribed) {
          setStatus([stats.status, json.status, stats.message])
          setLoading(false);
          setAvatar(avatarSave.avatar)
        }
        if (!stats.status) {
          return
        }
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
          if (isSubscribed) {
            setUser({...stats.stats, unit: json.status ? json.user.unit : 0});
            setLoading(false);
          }
          return;
      } catch (e) {
        console.error(e);
      }
      if (isSubscribed) {
        setLoading(false);
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
  
  if (loading) return (<div className="Main userProfile">
  <div className="MainBox userProfile">
  <Loading />
  </div>
</div>);
if (!status[0] && status[1]) {
  return (<div className="Main userProfile">
        <div className="MainBox userProfile notCenter">
        <strong
          className="animate__animated animate__backInLeft navigator"
          onClick={() => navigate("/friends")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Go back
        </strong>
        <div className="profile"><div className='message'><p>{status[2]}</p>
        </div></div></div><UI></UI></div>)
} 
if (!status[0]) {
  return (<div className="Main userProfile">
        <div className="MainBox userProfile">
        <div className="profile"><div className='message'><p>{status[2]}</p>
        <div><button className='btn' onClick={() => navigate('/login')}>Login</button><button className='btn' onClick={() => navigate('/register')}>Register</button></div>
        </div></div></div></div>)
} 
  if (!status[1]) {
    return (
      <>
      <div className="Main userProfile">
          <div className="MainBox userProfile">
          <div className="profile">
          <div className="user">
          <div className='loginRegister'><button className='btn' onClick={() => navigate('/login')}>Login</button><button className='btn' onClick={() => navigate('/register')}>Register</button></div>
            <h3>{user.name}</h3>
            <AvatarBox  body={avatar.body} eye={avatar.eye} face={avatar.face} hat={avatar.hat}/>
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
                {user.dayStreak === 0 ? null : `${user.dayStreak} Day${user.dayStreak > 1 ? "s" : ''} streak`}
              </h2>
            )}
          </div>
          <div className="stats">
            <div
              className="block animate__animated animate__zoomIn"
              style={{ animationDelay: "0s" }}
            >
              <strong>Best Planking Time</strong>
              {user.bestPlankTime === "000000" ? <p>0</p> : <ProfileTime props={user.bestPlankTime}></ProfileTime>}
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
              {user.totalPlankTime === "000000" ? <p>0</p> : <ProfileTime props={user.totalPlankTime}></ProfileTime>}
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
        </div>
      </div>
      </>
    );
  }
  return (
    <>
    <div className="Main userProfile">
        <div className="MainBox userProfile notCenter">
        <strong
          className="animate__animated animate__backInLeft navigator"
          onClick={() => navigate("/friends")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Go back
        </strong>
        <div className="profile">
        <div className="user">
          <h3>{user.name}</h3>
          <AvatarBox  body={avatar.body} eye={avatar.eye} face={avatar.face} hat={avatar.hat}/>
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
              {user.dayStreak === 0 ? null : `${user.dayStreak} Day${user.dayStreak > 1 ? "s" : ''} streak`}
            </h2>
          )}
        </div>
        <div className="stats">
          <div
            className="block animate__animated animate__zoomIn"
            style={{ animationDelay: "0s" }}
          >
            <strong>Best Planking Time</strong>
            {user.bestPlankTime === "000000" ? <p>0</p> : <ProfileTime props={user.bestPlankTime}></ProfileTime>}
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
            {user.totalPlankTime === "000000" ? <p>0</p> : <ProfileTime props={user.totalPlankTime}></ProfileTime>}
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
      </div>
      <UI></UI>
    </div>
    </>
  );
}