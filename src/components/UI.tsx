import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faFireBurner, faPowerOff, faUserGroup, faPeopleArrowsLeftRight, faGear, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { async } from '@firebase/util';


export function UI({props, setFriendRequestsAmount, friendRequestsAmount} :any) {
    const { pathname } = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken'])
    const navigate = useNavigate();
    // const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        
    //     fetch('/api/token',
    //       {
    //         method: "DELETE",
    //         body: null,
    //         headers: {
    //           "Content-Type": "application/json"
    //         }
    //       }
    //     ).then(() => {
    //         removeCookie('jwtToken')
    //         navigate('/login')
    //     })
    //   }
      if (pathname === '/termsOfService' || pathname === '/privacyPolicy') {
        return null
      }
  return (
    <>
    <div className="UI">
        <ul>
            <li className={   (pathname === '/days' || pathname === '/plank' ? ' active' : '')} style={{animationDelay: "0s"}}><button onClick={() => navigate('/days')}><FontAwesomeIcon icon={faHeartPulse}/> Plank</button></li>
            <li className={   (pathname === '/duel' ? ' active' : '')} style={{animationDelay: ".2s"}}><button onClick={() => navigate('/duel')}><FontAwesomeIcon icon={faPeopleArrowsLeftRight}/> Duel</button></li>
            <li className={   (pathname === '/profile' || pathname === '/profile/avatar' ? ' active' : '')}style={{animationDelay: ".4s"}}><button onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faAddressCard}/> Profile</button></li>
            <li className={   (pathname === '/friends' || pathname === '/friends/add' ? ' active' : '')} style={{animationDelay: ".6s"}}><button onClick={() => navigate('/friends')}><FontAwesomeIcon icon={faUserGroup}/> Social <span className={friendRequestsAmount ? 'friendRequestsAmount' : 'none'}>{friendRequestsAmount ? friendRequestsAmount : null}</span></button></li>
            <li className={   (pathname === '/settings' ? ' active' : '')} style={{animationDelay: ".8s"}}><button onClick={() => navigate('/settings')}><FontAwesomeIcon icon={faGear}/> Settings</button></li>
        </ul>
    </div>
    </>
  );
}
// eslint-disable-next-line no-lone-blocks
{/* <li className={'animate_animated animate__backInRight' + (pathname === '/days' || pathname === '/plank' ? ' active' : '')} style={{animationDelay: "0s"}}><button onClick={() => navigate('/days')}><FontAwesomeIcon icon={faHeartPulse}/> Plank</button></li>
            <li className={'animate_animated animate__backInRight' + (pathname === '/duel' ? ' active' : '')} style={{animationDelay: ".2s"}}><button onClick={() => navigate('/duel')}><FontAwesomeIcon icon={faPeopleArrowsLeftRight}/> Duel</button></li>
            <li className={'animate_animated animate__backInRight' + (pathname === '/profile' ? ' active' : '')}style={{animationDelay: ".4s"}}><button onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faAddressCard}/> Profile</button></li>
            <li className={'animate_animated animate__backInRight' + (pathname === '/friends' || pathname === '/friends/add' ? ' active' : '')} style={{animationDelay: ".6s"}}><button onClick={() => navigate('/friends')}><FontAwesomeIcon icon={faUserGroup}/> Social <span className={friendRequestsAmount ? 'friendRequestsAmount' : 'none'}>{friendRequestsAmount ? friendRequestsAmount : null}</span></button></li>
            <li className={'animate_animated animate__backInRight' + (pathname === '/settings' ? ' active' : '')} style={{animationDelay: ".8s"}}><button onClick={() => navigate('/settings')}><FontAwesomeIcon icon={faGear}/> Settings</button></li> */}
