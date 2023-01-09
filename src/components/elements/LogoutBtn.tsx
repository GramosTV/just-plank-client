import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
export function LogoutBtn(props: any) {
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    const navigate = useNavigate();
    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        
        fetch('/api/token',
          {
            method: "DELETE",
            body: null,
            headers: {
              "Content-Type": "application/json"
            }
          }
        ).then(() => {
            removeCookie('jwtToken')
            props.props(false)
        })
      }
    return <button className='btn' onClick={handleLogout}>Logout</button>
}
export function LogoutSettingsBtn({logoutFlag, setLogoutFlag}:any) {
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
      
      fetch('/api/token',
        {
          method: "DELETE",
          body: null,
          headers: {
            "Content-Type": "application/json"
          }
        }
      ).then(() => {
          removeCookie('jwtToken')
          setLogoutFlag(!logoutFlag)
      })
    }
  return <button className='btn' onClick={handleLogout}><FontAwesomeIcon icon={faPowerOff} /> Logout</button>
}
export function LogoutOnAllDevicesBtn({logoutFlag, setLogoutFlag}:any) {
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
      
      fetch('/api/settings/logoutOnAllDevices',
        {
          method: "DELETE",
          body: null,
          headers: {
            "Content-Type": "application/json"
          }
        }
      ).then(() => {
          removeCookie('jwtToken')
          setLogoutFlag(!logoutFlag)
      })
    }
  return <button className='btn' onClick={handleLogout}><FontAwesomeIcon icon={faPowerOff} /> Logout on all devices</button>
}