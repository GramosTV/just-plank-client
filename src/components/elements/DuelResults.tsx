import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loading } from './Loading';
import { ProfileTime } from './ProfileTime';

export function DuelResults(props: any) {
    const {data, states, setConfettiFlag} = props.props;
    let vicAudio = useRef<any>(null)
    let defAudio = useRef<any>(null)
    useMemo(() => {
        vicAudio.current = new Audio('/audio/victory.wav')
        defAudio.current = new Audio('/audio/defeat.ogg')
    }, [vicAudio, defAudio]);
    
    useEffect(() => {
        if (states.hostDuel && data.hostTimeSent && data.playerTimeSent && data.hostTime > data.playerTime) {
            setConfettiFlag(true)
        }
        if (states.joinDuel && data.hostTimeSent && data.playerTimeSent && data.hostTime < data.playerTime) {
            setConfettiFlag(true)
        }
        if (states.hostDuel && data.hostTimeSent) {
            if(data.playerTimeSent) {
                if(data.hostTime > data.playerTime) {
                    vicAudio.current.play()
                }
                if(data.hostTime < data.playerTime) {
                    defAudio.current.play()
                }
            }
        }
        if (states.joinDuel && data.playerTimeSent) {
            if (data.hostTimeSent) {
                if(data.hostTime < data.playerTime) {
                    vicAudio.current.play()
                }
                if(data.hostTime > data.playerTime) {
                    defAudio.current.play()
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.hostTimeSent, data.playerTimeSent])
    if (states.hostDuel && data.hostTimeSent) {
        if (data.playerTimeSent) {
            if (data.hostTime === data.playerTime) {
                return (<>
                    <h2>Draw</h2>
                    <div className="playerContainer animate__animated animate__zoomIn">
                    <div className="player"><span>{data.playerName}</span><ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
                    <div className="vsWrapper">
                    <h3>VS</h3>
                    </div>
                    <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
                    </div>
                    </>)
            }
            if (data.hostTime > data.playerTime) {
                return (<>
            <h2 className='Victory'>Victory!</h2>
            <div className="playerContainer animate__animated animate__zoomIn">
            <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            <div className="vsWrapper">
            <h3>VS</h3>
            </div>
            <div className="player"><span>{data.playerName}</span><ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            </div>
            </>)
            } else {
                return (<>
            <h2 className='Defeat'>Defeat</h2>
            <div className="playerContainer animate__animated animate__zoomIn">
            <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            <div className="vsWrapper">
            <h3>VS</h3>
            </div>
            <div className="player"><span>{data.playerName}</span>
            <ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            </div>
            </>)
            }
        } else {
            return (
            <><h2 className='animate__animated animate__zoomIn'>Waiting for player</h2>
            <Loading></Loading></>)
           
        }
    }
    if (states.joinDuel && data.playerTimeSent) {
        if (data.hostTimeSent) {
            if (data.hostTime === data.playerTime) {
                return (<>
                    <h2>Draw</h2>
                    <div className="playerContainer animate__animated animate__zoomIn">
                    <div className="player"><span>{data.playerName}</span><ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
                    <div className="vsWrapper">
                    <h3>VS</h3>
                    </div>
                    <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
                    </div>
                    </>)
            }
            if (data.hostTime < data.playerTime) {
                return (<>
            <h2 className='Victory'>Victory!</h2>
            <div className="playerContainer animate__animated animate__zoomIn">
            <div className="player"><span>{data.playerName}</span><ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            <div className="vsWrapper">
            <h3>VS</h3>
            </div>
            <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            </div>
            </>)
            } else {
                return (<>
            <h2 className='Defeat'>Defeat</h2>
            <div className="playerContainer animate__animated animate__zoomIn">
            <div className="player"><span>{data.playerName}</span><ProfileTime props={String(Number(new Date(data.playerTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            <div className="vsWrapper">
            <h3>VS</h3>
            </div>
            <div className="player"><span>{data.hostName}</span><ProfileTime props={String(Number(new Date(data.hostTime * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')}/></div>
            </div>
            </>)
            }
        } else {
            return (
            <><h2 className='animate__animated animate__zoomIn'>Waiting for player</h2>
            <Loading></Loading></>)
           
        }
    }
    return <Loading></Loading>
}
    
    