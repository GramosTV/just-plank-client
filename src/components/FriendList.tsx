import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {User} from '../interfaces/user'
import { BMI } from './elements/BMI';
import { FriendsTable } from './elements/FriendsTable';
import { Loading } from './elements/Loading';
import { ProfileTime } from './elements/ProfileTime';
import { MainBox } from './MainBox';
import { UI } from './UI';

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number;
  totalCaloriesBurnt: number;
  totalPlankTime: number;
}

export function FriendList({props, friendRequestsAmount}:any) {
  const [user, setUser] = useState<ProfileStats>({
    id: '',
    email: '',
    password: '',
    name: '',
    unit: 0,
    dateOfBirth: '',
    gender: 0,
    height: 0,
    weight: 0,
    statsSet: 0,
    emailVerified: 0,
    isGoogleAccount: 0,
    profile: 0,
    totalDays: 0,
    totalPlanks: 0,
    bestPlankTime: 0,
    totalCaloriesBurnt: 0,
    totalPlankTime: 0,
  })
  const [friends, setFriends] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate();
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
        try {
            const response = await fetch(`/api/user`);
            const friends = await (await fetch(`/api/friends`)).json()
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              navigate('/login')
            } else if(json.status && json.user.statsSet === 0) {
              navigate('/stats')
            }
             else if (json.status) {
              const userStats = await fetch(`/api/profile`);
              let stats = await userStats.json();
              stats.stats.bestPlankTime = Number(new Date(stats.stats.bestPlankTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''));
              stats.stats.totalPlankTime = Number(new Date(stats.stats.totalPlankTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''));
              stats.stats.bestPlankTime = String(stats.stats.bestPlankTime).padStart(6, '0')
              stats.stats.totalPlankTime = String(stats.stats.totalPlankTime).padStart(6, '0')
              if (isSubscribed) {
                setUser(Object.assign(json.user, stats.stats))
                setFriends(friends.friends.map((obj: any) => ({ ...obj, unfriend: obj.name })))
                setLoading(false)
              }
              return
            } else {
              navigate('/login')
            }
        } catch (e) {
            console.error(e);
            if (isSubscribed) {
              setLoading(false)
            }
        }
    };
    fetchUser();
    return () => {isSubscribed = false}
}, [navigate]);
const columns = useMemo(
  () => [
    {
      Header: "Friends",
      columns: [
        {
          Header: "Name",
          accessor: "name",
          disableSortBy: true
        },
        {
          Header: "Total days",
          accessor: "totalDays"
        },
        {
          Header: "Total Planks",
          accessor: "totalPlanks"
        },
        {
          Header: "Best Plank Time",
          accessor: "bestPlankTime"
        },
        {
          Header: "Total Calories Burnt",
          accessor: "totalCaloriesBurnt"
        },
        {
          Header: "Total Plank Time",
          accessor: "totalPlankTime"
        },
        {
          Header: " ",
          accessor: "unfriend",
          disableSortBy: true
        },
      ]
    },
  ],
  []
);
  const [deleteState, setDeleteState] = useState<boolean>(false)
  const doToast = (content: string) => {
    toast(content);
  }
  const deleteTimeout = () => {setTimeout(() => {
    setDeleteState(false)
  }, 3500)}
  if(loading) return <Loading/>
  return (
    <>
    <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    <div className="friendsList">
      {friends.length ? 
      <>
      <div className='friendsContainer'><h2>Friends</h2><button className='btn' onClick={() => navigate('/friends/add')}> Add Friends <span className={friendRequestsAmount ? 'friendRequestsAmount' : 'none'}>{friendRequestsAmount ? friendRequestsAmount : null}</span></button></div>
       <FriendsTable columns={columns} data={friends} friends={friends} setFriends={setFriends} navigate={navigate} doToast={doToast} deleteState={deleteState} setDeleteState={setDeleteState} deleteTimeout={deleteTimeout}/>
      </>
      : <><h3>You don't have any friends yet <FontAwesomeIcon icon={faFaceFrown}/></h3>
      <button className='btn noFriends' onClick={() => navigate('/friends/add')}> Add Friends <span className={friendRequestsAmount ? 'friendRequestsAmount' : 'none'}>{friendRequestsAmount ? friendRequestsAmount : null}</span></button>
      </>}
    </div>
    </>
  );
}