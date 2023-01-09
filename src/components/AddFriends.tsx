import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { User } from "../interfaces/user";
import { BMI } from "./elements/BMI";
import { Loading } from "./elements/Loading";
import { ProfileTime } from "./elements/ProfileTime";
import { MainBox } from "./MainBox";
import { UI } from "./UI";
import fuzzysort from "fuzzysort";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number;
  totalCaloriesBurnt: number;
  totalPlankTime: number;
}

export function AddFriends({ props, setFriendRequestsAmount }: any) {
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
    profile: 0,
    totalDays: 0,
    totalPlanks: 0,
    bestPlankTime: 0,
    totalCaloriesBurnt: 0,
    totalPlankTime: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSearchLoading, setUserSearchLoading] = useState<boolean>(false)
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
          let stats = await (await fetch(`/api/profile`)).json();
          const requests = await (await fetch(`/api/friendRequests`)).json();
          const pendingRequests = await (
            await fetch(`/api/pendingFriendRequests`)
          ).json();
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
            setUser(Object.assign(json.user, stats.stats));
            setFriendRequests(requests.friendRequests);
            setPendingFriendRequests(pendingRequests.pendingFriendRequests);
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
  
  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 25 && e.target.value.length >= 1) {
      try {
        setUserSearchLoading(true)
        const users = await fetch(`/api/users/${e.target.value}`);
        const data = await users.json();
        if (data.status) {
          setUsers(
            fuzzysort.go(e.target.value, data.users, { key: "name" }) as any
          );
        }
        setUserSearchLoading(false)
      } catch (e) {
        setUserSearchLoading(false)
        console.log(e);
      }
    } else {
      setUsers([]);
    }
  };
  const handleFriendRequestAccept = async (e: any) => {
    const name = e.currentTarget.parentNode.parentNode.id;
    fetch("/api/friendRequest", {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
          (async () => {
            const { amount } = await (
              await fetch("/api/friendRequestsAmount")
            ).json();
            setFriendRequestsAmount(amount);
          })();
      });
      setFriendRequests(
        friendRequests.filter((e: { name: string }) => e !== name)
      );
  };
  const handleFriendRequestDeny = async (e: any) => {
    const name = e.currentTarget.parentNode.parentNode.id;
    fetch("/api/friendRequest", {
      method: "DELETE",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      (async () => {
        const { amount } = await (
          await fetch("/api/friendRequestsAmount")
        ).json();
        setFriendRequestsAmount(amount);
      })();
    });
    setFriendRequests(
      friendRequests.filter((e: { name: string }) => e !== name)
    );
  };
  const handlePendingFriendRequestDelete = async (e: any) => {
    const name = e.currentTarget.parentNode.id;
    fetch("/api/pendingFriendRequest", {
      method: "DELETE",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    setPendingFriendRequests(
      pendingFriendRequests.filter(
        (e: { name: string }) => e !== name
      )
    )
  };
  const handleSendingFriendRequest = async (e: any) => {
    const name = e.currentTarget.parentNode.id;
    fetch("/api/friendRequest", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status) {
          if (res.data.friendRequest) {
            setPendingFriendRequests(
              [...pendingFriendRequests].concat(res.data.name)
            );
          } else {
            setFriendRequests(
              [...friendRequests].filter((e) => e !== res.data.name)
            );
          }
        } else {
          toast(res.message);
        }
      });
      setUsers([...users].filter((e: any) => e.target !== name));
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
      <div className="addFriends">
        <strong
          className="animate__animated animate__backInLeft navigator"
          onClick={() => navigate("/friends")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Go back
        </strong>
        <div className="friendRequests">
          <div className="requests">
            <h2>Friend Requests</h2>
            {friendRequests.length ? (
              <ul className='scroll'>
                {friendRequests.map((e) => (
                  <li id={e} key={e}>
                    {e}
                    <aside>
                      <FontAwesomeIcon
                        onClick={handleFriendRequestAccept}
                        icon={faCheck}
                      />{" "}
                      <FontAwesomeIcon
                        onClick={handleFriendRequestDeny}
                        icon={faXmark}
                      />
                    </aside>
                  </li>
                ))}
              </ul>
            ) : (
              <h3>You don't have any friend requests</h3>
            )}
          </div>
          <div className="pendingRequests">
            <h2>Pending</h2>
            {pendingFriendRequests.length ? (
              <ul className='scroll'>
                {pendingFriendRequests.map((e) => (
                  <li id={e} key={e}>
                    {e}{" "}
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={handlePendingFriendRequestDelete}
                    />{" "}
                  </li>
                ))}
              </ul>
            ) : (
              <h3>You don't have any pending friend requests</h3>
            )}
          </div>
        </div>
        <div className="friendSearchList">
          <h2>Add Friends</h2>
          <input
            type="text"
            onChange={handleInput}
            maxLength={25}
            minLength={1}
            placeholder="Search"
          />
          <ul className='scroll'>
            {users.map((e) => (
              <li id={e.target} key={e.target}>
                {e.target}
                <FontAwesomeIcon
                  onClick={handleSendingFriendRequest}
                  icon={faUserPlus}
                />
              </li>
            ))}
          </ul>
          {userSearchLoading ? <Loading></Loading> : null}
        </div>
      </div>
    </>
  );
}
