import React, {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {User} from '../interfaces/user'
import { Loading } from './elements/Loading';
import { MainBox } from './MainBox';
import { UI } from './UI';



export function Main(props:any) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshUser, setRefreshUser] = useState<boolean>(false)
  const refreshUserRef = useRef<boolean | string>('')
  const [user, setUser] = useState<User>({
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
  })
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === '/termsOfService' || pathname === '/privacyPolicy' || pathname.startsWith('/userProfile')) {
      setLoading(false)
      return
    }
    async function fetchUser() {
        try {
            const response = await fetch(`/api/user`);
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              navigate('/login')
            } else if(json.status && json.user.statsSet === 0) {
              navigate('/stats')
            }
             else if (json.status) {
              setLoading(false);
              setUser(json.user)
              return
            } else {
              navigate('/login')
            }
        } catch (e) {
            console.error(e);
        }
    };
    if (refreshUserRef.current === '') {
      refreshUserRef.current = refreshUser
    }
    if (!user.id || (refreshUser !== refreshUserRef.current)) {
      refreshUserRef.current = refreshUser
      fetchUser();  
    }
}, [navigate, refreshUser]);
const [friendRequestsAmount, setFriendRequestsAmount] = useState<number>(0);
  useEffect(() => {
    if (user.id && !(pathname === '/termsOfService') && !(pathname === '/privacyPolicy') && !(pathname.startsWith('/userProfile'))) {
  (async () => {
    const {amount} = await (await fetch('/api/friendRequestsAmount')).json()
    if(amount !== friendRequestsAmount) {
      setFriendRequestsAmount(amount)
    }
  })()
  }
  })
  if (loading) {
    return (<>
    <div className="screenContainer">
      <Loading></Loading>
    </div>
    </>)
  }
  return (
    <>
    <div className="Main">
    <MainBox props={user} setFriendRequestsAmount={setFriendRequestsAmount} friendRequestsAmount={friendRequestsAmount} refreshUser={refreshUser} setRefreshUser={setRefreshUser}></MainBox>
    <UI props={user} friendRequestsAmount={friendRequestsAmount}></UI>
    </div>
    </>
  );
}
