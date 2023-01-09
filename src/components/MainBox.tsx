import React, {useEffect} from 'react';
import { Route, Routes, useNavigate, HashRouter } from 'react-router-dom';
import { AddFriends } from './AddFriends';
import { Avatar } from './Avatar';
import { PrivacyPolicy } from './docs/PrivacyPolicy';
import { TermsOfService } from './docs/TermsOfService';
import { Duel } from './Duel';
import { DuelExit } from './elements/DuelExit';
import { EmailVerification } from './EmailVerification';
import { FriendList } from './FriendList';
import { Chart } from './plank/Chart';
import {Days} from './plank/Days'
import { Plank } from './plank/Plank';
import { Profile } from './Profile';
import { Settings } from './Settings';



export function MainBox({props, setFriendRequestsAmount, friendRequestsAmount, refreshUser, setRefreshUser} :any) {
  return (
    <>
    <div className="MainBox">
      <Routes>
        <Route path='/days' element={<Days props={props}></Days>}/>
        <Route path='/profile' element={<Profile></Profile>}/>
        <Route path='/plank' element={<Plank props={props}></Plank>}/>
        <Route path='/friends/add' element={<AddFriends setFriendRequestsAmount={setFriendRequestsAmount}></AddFriends>}/>
        <Route path='/friends' element={<FriendList setFriendRequestsAmount={setFriendRequestsAmount} friendRequestsAmount={friendRequestsAmount}></FriendList>}/>
        <Route path='/duel' element={<Duel></Duel>}/>
        <Route path='/settings' element={<Settings refreshUser={refreshUser} setRefreshUser={setRefreshUser}></Settings>}/>
        <Route path='/duel/duelExit' element={<DuelExit></DuelExit>}/>
        <Route path='/profile/avatar' element={<Avatar></Avatar>}/>
        </Routes>
    </div>
    </>
  );
}