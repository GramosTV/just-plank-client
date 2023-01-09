import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from './Loading';
import { ProfileTime } from './ProfileTime';
  export function DuelListElement({duel, userId, hostRejoinDuel, rejoinDuel}: any) {
    const navigate = useNavigate()
    const isHost = duel.hostId === userId ? true : false;
    if(!duel.startCountdown && isHost) {
        return <div className="duelListElement pending"><div>Ongoing Duel </div> <div className='alwaysVisible'><button className='btn' onClick={() => hostRejoinDuel(duel.id)}>Rejoin</button></div>
        <Loading></Loading>
        </div>
    } 
    if(!duel.startCountdown && !isHost) {
        return <div className="duelListElement pending"><div>Ongoing Duel </div> <div className='alwaysVisible'><button className='btn' onClick={() => rejoinDuel(duel.id)}>Rejoin</button></div>
        <Loading></Loading>
        </div>
    } 
    if(!duel.hostTimeSent && isHost) {
        return <div className="duelListElement pending"><div>Ongoing Duel </div> <div className='alwaysVisible'><button className='btn' onClick={() => hostRejoinDuel(duel.id)}>Rejoin</button></div>
        <Loading></Loading>
        </div>
    } 
    if(!duel.playerTimeSent && !isHost) {
        return <div className="duelListElement pending"><div>Ongoing Duel </div> <div className='alwaysVisible'><button className='btn' onClick={() => rejoinDuel(duel.id)}>Rejoin</button></div>
        <Loading></Loading>
        </div>
    } 
    
    if(!duel.finished && !isHost && duel.playerTimeSent) {
        return (<>
        <div className="duelListElement pending">
            <span>Duel not settled yet</span>
            <br />
            <button className='btn' onClick={() => {fetch('/api/duel/leaveDuel', {method: 'DELETE'}); navigate('/duel/duelExit')}}>Leave duel<FontAwesomeIcon icon={faDoorOpen}/></button>
            <Loading></Loading>
        </div>
        </>)
    }
    if(!duel.finished) {
        return (<>
        <div className="duelListElement pending">
            <span>Duel not settled yet</span>
            <Loading></Loading>
        </div>
        </>)
    }
    if(isHost) {
    return (<>
    <div className="duelListElement">
        <div>
        <strong className='royalblue mobile'>{duel.hostName}</strong>
        <ProfileTime props={String(Number(new Date(duel.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/>
        {duel.hostTime === duel.playerTime ? <strong className={'Draw'}>Draw</strong> : <strong className={duel.hostTime > duel.playerTime ? 'Victory' : 'Defeat'}>{duel.hostTime > duel.playerTime ? 'Victory' : 'Defeat'}</strong>}
        <ProfileTime props={String(Number(new Date(duel.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/>
        <strong className='red mobile'>{duel.playerName}</strong>
        </div>
        <div>
        <p className='royalblue'>{duel.hostName}</p>
            <strong>VS</strong>
        <p className='red'>{duel.playerName}</p>
        </div>
    </div>
    </>)
    }
    return (<>
    <div className="duelListElement">
    <div>
    <strong className='royalblue mobile'>{duel.playerName}</strong>
    <ProfileTime className='royalblue' props={String(Number(new Date(duel.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/>
    {duel.hostTime === duel.playerTime ? <strong className={'Draw'}>Draw</strong> : <strong className={duel.hostTime < duel.playerTime ? 'Victory' : 'Defeat'}>{duel.hostTime < duel.playerTime ? 'Victory' : 'Defeat'}</strong>}
    <ProfileTime props={String(Number(new Date(duel.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/>
    <strong className='red mobile'>{duel.hostName}</strong>
    </div>
    <div>
    <p className='royalblue'>{duel.playerName}</p>
    <strong>VS</strong>
    <p className='red'>{duel.hostName}</p>
    </div>
    </div>
    </>)
}