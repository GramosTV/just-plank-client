import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
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
  faArrowRightFromBracket,
  faCheck,
  faDoorOpen,
  faShareFromSquare,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import Timer from "react-compound-timerv2/build";
import { setEnvironmentData } from "worker_threads";
//@ts-ignore
import ConfettiGenerator from "confetti-js";
import { DuelResults } from "./elements/DuelResults";
import { DuelListElement } from "./elements/DuelListElement";

interface FormElements extends HTMLFormControlsCollection {
  duelCode: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface ProfileStats extends User {
  totalDays: number;
  totalPlanks: number;
  bestPlankTime: number;
  totalCaloriesBurnt: number;
  totalPlankTime: number;
}

export function Duel(props: any) {
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
  let countdownAudio = useRef<any>(null)
    useMemo(() => {
        countdownAudio.current = new Audio('/audio/countdown.wav')
    }, [countdownAudio]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        const duels = await (await fetch(`/api/duels`)).json();
        if (isSubscribed) {
          setUser(json.user);
          setDuels(duels.duels);
        }
        if (json.status && json.user.emailVerified === 0) {
          navigate('/login');
        } else if (json.status && json.user.statsSet === 0) {
          navigate("/stats");
        } else if (json.status) {
          if (isSubscribed) {
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
  
  const [duels, setDuels] = useState<any>([]);
  const [data, setData] = useState<any>(false);
  const dataRef = useRef<any>(false);
  const [hostDuel, setHostDuel] = useState<boolean>(false);
  const [joinDuel, setJoinDuel] = useState<boolean>(false);
  const [duelCode, setDuelCode] = useState<string>("");
  const [player, setPlayer] = useState("");
  const waitingForPlayerInterval = useRef<any>(null);
  const waitingForHostInterval = useRef<any>(null);
  const startCountdown = useRef<any>(null);
  const startPlayerCountdown = useRef<any>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [stopwatch, setStopwatch] = useState<boolean>(false);
  const Stime = useRef<number>(0);
  const Mtime = useRef<number>(0);
  const Htime = useRef<number>(0);
  const apiCountdown = useRef<number>(0);
  const refCountdown = useRef<number>(0);
  const [end, setEnd] = useState<boolean>(false);
  const [confettiFlag, setConfettiFlag] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      clearInterval(waitingForPlayerInterval.current);
      clearInterval(waitingForHostInterval.current);
      clearInterval(startCountdown.current);
      clearInterval(startPlayerCountdown.current);
      setUser({
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
    };
  }, []);

  const startDuel = async () => {
    await fetch("/api/duel", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const sendTime = async (num: number) => {
    if (num) {
      await fetch("/api/duel/sendPlayerTime", {
        method: "PUT",
        body: JSON.stringify({
          time: Stime.current + Mtime.current + Htime.current,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetch('/api/plank',
    {
      method: "POST",
      body: JSON.stringify({
      dayNumeration: 0,
      dayId: 0,
      plankTime: 
      Stime.current +
        Mtime.current +
        Htime.current,
      caloriesBurnt: Math.round((
        Stime.current / 60 +
        Mtime.current / 60 +
        Htime.current / 60) * 
        (user.unit ? 0.05733 * user.weight : 0.026 * user.weight)
        ),
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    } else {
      await fetch("/api/duel/sendHostTime", {
        method: "PUT",
        body: JSON.stringify({
          time: Stime.current + Mtime.current + Htime.current,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetch('/api/plank',
    {
      method: "POST",
      body: JSON.stringify({
      dayNumeration: 0,
      dayId: 0,
      plankTime: 
      Stime.current +
        Mtime.current +
        Htime.current,
      caloriesBurnt: Math.round((
        Stime.current / 60 +
        Mtime.current / 60 +
        Htime.current / 60) * 
        (user.unit ? 0.05733 * user.weight : 0.026 * user.weight)
        ),
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then(() => {
    fetch('/api/day',
    {
      method: "PUT",
      body: JSON.stringify({
        weight: 0,
        dayNumeration: 0,
        finish: 0,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  })
    }
  };

  const handleHostDuel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const createDuel = await (
      await fetch("api/duel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (createDuel.status) {
      setDuelCode(createDuel.duelCode);
      setHostDuel(true);
      waitingForPlayerInterval.current = setInterval(async () => {
        const duel = await (await fetch("/api/duel")).json();
        if (!duel.status) {
          toast("This duel has been canceled");
          navigate("/duel/duelExit");
          return;
        }
        if (!duel.duel.playerId && dataRef.current) {
          toast("Player has left your duel");
          const hostData = await (await fetch("/api/duel/hostData")).json();
          if (!hostData.status) {
            toast("This duel has been canceled");
            return;
          }
          setData(false);
          setPlayer("");
          dataRef.current = false;
          return;
        }
        console.log("Waiting for player");
        if (duel.duel.playerId) {
          if (!data) {
            const hostData = await (await fetch("/api/duel/hostData")).json();
            if (!hostData.status) {
              toast("This duel has been canceled");
              navigate("/duel/duelExit");
              return;
            }
            setData(hostData.data);
            dataRef.current = hostData.data;
          }
          if (!player) {
            setPlayer(duel.duel.playerId);
          }
          if (duel.duel.startCountdown) {
            apiCountdown.current = 1;
          }
          if (!startCountdown.current) {
            startCountdown.current = setInterval(() => {
              if (apiCountdown.current && !refCountdown.current) {
                refCountdown.current = 5;
                setCountdown(5);
                countdownAudio.current.play()
              } else if (refCountdown.current > 1 && apiCountdown.current) {
                refCountdown.current = refCountdown.current - 1;
                setCountdown(refCountdown.current);
              } else if (refCountdown.current === 1 && apiCountdown.current) {
                refCountdown.current = -1;
                setCountdown(-1);
                clearInterval(startCountdown.current);
                clearInterval(waitingForPlayerInterval.current);
                setStopwatch(true);
              }
            }, 1000);
          }
        }
      }, 1000);
    } else {
      toast(createDuel.message);
    }
  };
  const handleDuelJoin = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    const duelCode = e.currentTarget.elements.duelCode.value;
    const joinDuel = await (
      await fetch("/api/joinDuel", {
        method: "PUT",
        body: JSON.stringify({
          duelCode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (joinDuel.status) {
      setDuelCode(duelCode);
      setJoinDuel(true);
      waitingForHostInterval.current = setInterval(async () => {
        const duel = await (await fetch("/api/joinDuel")).json();
        if (!duel.status) {
          toast("This duel has been canceled");
          navigate("/duel/duelExit");
        }
        if (!data) {
          const playerData = await (await fetch("/api/duel/playerData")).json();
          if (!playerData.status) {
            toast("This duel has been canceled");
            navigate("/duel/duelExit");
          }
          setData(playerData.data);
          dataRef.current = playerData.data;
        }
        console.log("Waiting for host");
        if (!duel.status) {
          toast("Duel has been canceled");
          navigate("/duel/duelExit");
        }
        if (duel.duel.startCountdown) {
          apiCountdown.current = 1;
          if (!player) {
            setPlayer(duel.duel.playerId);
          }
          if (!startPlayerCountdown.current) {
            startPlayerCountdown.current = setInterval(() => {
              if (apiCountdown.current && !refCountdown.current) {
                refCountdown.current = 5;
                setCountdown(5);
                countdownAudio.current.play()
              } else if (refCountdown.current > 1 && apiCountdown.current) {
                refCountdown.current = refCountdown.current - 1;
                setCountdown(refCountdown.current);
              } else if (refCountdown.current === 1 && apiCountdown.current) {
                refCountdown.current = -1;
                setCountdown(-1);
                clearInterval(startPlayerCountdown.current);
                clearInterval(waitingForHostInterval.current);
                setStopwatch(true);
              }
            }, 1000);
          }
        }
      }, 1000);
    } else {
      toast(joinDuel.message);
    }
  };
  const hostRejoinDuel = async (code: string) => {
    setDuelCode(code);
    setHostDuel(true);
    waitingForPlayerInterval.current = setInterval(async () => {
      const duel = await (await fetch("/api/duel")).json();
      if (!duel.status) {
        toast("This duel has been canceled");
        navigate("/duel/duelExit");
      }
      if (!duel.duel.playerId && dataRef.current) {
        toast("Player has left your duel");
        const hostData = await (await fetch("/api/duel/hostData")).json();
        if (!hostData.status) {
          toast("This duel has been canceled");
          return;
        }
        setData(false);
        setPlayer("");
        dataRef.current = false;
        return;
      }
      console.log("Waiting for player");
      if (duel.duel.playerId) {
        if (!data) {
          const hostData = await (await fetch("/api/duel/hostData")).json();
          if (!hostData.status) {
            toast("This duel has been canceled");
            navigate("/duel/duelExit");
          }
          setData(hostData.data);
          dataRef.current = hostData.data;
        }
        if (!player) {
          setPlayer(duel.duel.playerId);
        }
        if (duel.duel.startCountdown) {
          apiCountdown.current = 1;
        }
        if (!startCountdown.current) {
          startCountdown.current = setInterval(() => {
            if (apiCountdown.current && !refCountdown.current) {
              refCountdown.current = 5;
              setCountdown(5);
            } else if (refCountdown.current > 1 && apiCountdown.current) {
              refCountdown.current = refCountdown.current - 1;
              setCountdown(refCountdown.current);
            } else if (refCountdown.current === 1 && apiCountdown.current) {
              refCountdown.current = -1;
              setCountdown(-1);
              clearInterval(startCountdown.current);
              clearInterval(waitingForPlayerInterval.current);
              setStopwatch(true);
            }
          }, 1000);
        }
      }
    }, 1000);
  };
  const rejoinDuel = async (code: string) => {
    const duelCode = code;
    const joinDuel = await (await fetch("/api/duel/playerData")).json();
    if (joinDuel.status) {
      setDuelCode(duelCode);
      setJoinDuel(true);
      waitingForHostInterval.current = setInterval(async () => {
        const duel = await (await fetch("/api/joinDuel")).json();
        if (!duel.status) {
          toast("This duel has been canceled");
          navigate("/duel/duelExit");
        }
        if (!data) {
          const playerData = await (await fetch("/api/duel/playerData")).json();
          if (!playerData.status) {
            toast("This duel has been canceled");
            navigate("/duel/duelExit");
          }
          setData(playerData.data);
          dataRef.current = playerData.data;
        }
        console.log("Waiting for host");
        if (duel.duel.startCountdown) {
          apiCountdown.current = 1;
          if (!player) {
            setPlayer(duel.duel.playerId);
          }
          if (!startPlayerCountdown.current) {
            startPlayerCountdown.current = setInterval(() => {
              if (apiCountdown.current && !refCountdown.current) {
                refCountdown.current = 5;
                setCountdown(5);
              } else if (refCountdown.current > 1 && apiCountdown.current) {
                refCountdown.current = refCountdown.current - 1;
                setCountdown(refCountdown.current);
              } else if (refCountdown.current === 1 && apiCountdown.current) {
                refCountdown.current = -1;
                setCountdown(-1);
                clearInterval(startPlayerCountdown.current);
                clearInterval(waitingForHostInterval.current);
                setStopwatch(true);
              }
            }, 1000);
          }
        }
      }, 1000);
    } else {
      toast(joinDuel.message);
    }
  };

  useEffect(() => {
    if (end) {
      if (hostDuel) {
        waitingForPlayerInterval.current = setInterval(async () => {
          const hostData = await (await fetch("/api/duel/hostData")).json();
          setData(hostData.data);
          dataRef.current = hostData.data;
        }, 1000);
      } else {
        waitingForHostInterval.current = setInterval(async () => {
          const playerData = await (await fetch("/api/duel/playerData")).json();
          setData(playerData.data);
          dataRef.current = playerData.data;
        }, 1000);
      }
    }
  }, [end]);
  useEffect(() => {
    let confetti: any = null;
    if (confettiFlag) {
      const confettiSettings = {
        target: "my-canvas",
        max: 110,
        size: 1.1,
        start_from_edge: true,
      };
      confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    } else {
      if (confetti) confetti.clear();
    }
    return () => {
      if (confetti) confetti.clear();
    };
  }, [confettiFlag]);
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  };
  if (loading) return <Loading />;
  if (end)
    return (
      <>
        <canvas id="my-canvas"></canvas>
        <div className="duelTimerContainer">
          <DuelResults
            props={{ data, states: { hostDuel, joinDuel }, setConfettiFlag }}
          ></DuelResults>
          <strong
            onClick={() => {
              navigate("/duel/duelExit");
            }}
          >
            Exit <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </strong>
        </div>
      </>
    );
  if (countdown && countdown !== -1)
    return (
      <>
      <div className="duelTimerContainer">
        <h2 className="timeH2">{countdown}</h2>
        </div>
      </>
    );
  if (stopwatch)
    return (
      <>
        <div className="duelTimerContainer">
          <Timer initialTime={0} startImmediately={true} timeToUpdate={10}>
            {({ start, resume, pause, stop, reset, timerState }: any) => (
              <React.Fragment>
                <div>
                  <Timer.Hours
                    formatValue={(value) => {
                      if (value > 0 || value < 60) {
                        Htime.current = value * 60 * 60;
                      }
                      return String(value).length < 2
                        ? `0${value}`
                        : String(value);
                    }}
                  />
                  :
                  <Timer.Minutes
                    formatValue={(value) => {
                      if (value > 0 || value < 60) {
                        Mtime.current = value * 60;
                      }
                      return String(value).length < 2
                        ? `0${value}`
                        : String(value);
                    }}
                  />
                  :
                  <Timer.Seconds
                    formatValue={(value) => {
                      if (value > 0 || value < 60) {
                        Stime.current = value;
                      }
                      return String(value).length < 2
                        ? `0${value}`
                        : String(value);
                    }}
                  />
                  :
                  <Timer.Milliseconds
                    formatValue={(value) => {
                      if (String(value).length >= 2) {
                        return String(value).slice(0, 2);
                      } else {
                        return "0" + String(value);
                      }
                    }}
                  />
                </div>
                {/* <div>{timerState}</div> */}
                <div className="stopwatchButtons">
                  <button
                    className="btn"
                    onClick={async () => {
                      hostDuel ? sendTime(0) : sendTime(1);
                      setEnd(true);
                      stop();
                      setStopwatch(false);
                    }}
                  >
                    Stop
                  </button>
                </div>
              </React.Fragment>
            )}
          </Timer>
        </div>
      </>
    );
  if (joinDuel)
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
        <div className="duelTimerContainer">
          <h2>
            Waiting for host to start <Loading></Loading>
          </h2>
          {data ? (
            <>
              <div className="playerContainer animate__animated animate__zoomIn">
                <div className="player">
                  <span>{data.playerName}</span>
                </div>
                <div className="vsWrapper">
                  <h3>VS</h3>
                </div>
                <div className="player">
                  <span>{data.hostName}</span>
                </div>
              </div>
              <strong
                className={"exitDuel"}
                onClick={() => {
                  fetch("/api/duel/leaveDuel", { method: "DELETE" });
                  navigate("/duel/duelExit");
                }}
              >
                Leave duel <FontAwesomeIcon icon={faDoorOpen} />
              </strong>
            </>
          ) : (
            null
          )}
        </div>
      </>
    );
  if (hostDuel)
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
        <div className="duelContainer">
          {player ? (
            <>
              {data ? (
                <>
                  <div className="playerContainer animate__animated animate__zoomIn">
                    <div className="player">
                      <span>{data.hostName}</span>
                    </div>
                    <div className="vsWrapper">
                      <h3>VS</h3>
                    </div>
                    <div className="player">
                      <span>{data.playerName}</span>
                    </div>
                  </div>
                  {data.startCountdown ? <button className="duel">
                  <Loading />
                  </button> : 
                  <button className="duel" onClick={startDuel}>
                  Start Duel
                  </button>
                  }
                  
                  <strong
                    className="exitDuel"
                    onClick={() => {
                      fetch("/api/duel", { method: "DELETE" });
                      navigate("duelExit");
                    }}
                  >
                    Cancel <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  </strong>
                </>
              ) : (
                null
              )}
            </>
          ) : (
            <>
              <h2>Duel code is {duelCode} 
              <FontAwesomeIcon onClick={() => {
            copyToClipboard(duelCode);
          toast('Code copied to clipboard')}} icon={faShareFromSquare}
          style={{cursor: 'pointer', marginLeft: '8px', fontSize: '28px'}}
          />
              </h2>
              <div>
                <strong>Waiting for Player to join</strong>
                <Loading></Loading>
                <strong
                  className="exitDuel"
                  onClick={() => {
                    fetch("/api/duel", { method: "DELETE" });
                    navigate("duelExit");
                  }}
                >
                  Cancel <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </strong>
              </div>
            </>
          )}
        </div>
      </>
    );
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
      <div className="duelStarterContainer">
        <div className="duelsList animate__animated animate__slideInUp">
          <h2>History</h2>
          {duels.length ? 
          <ul className='scroll'>
          {duels.map((e: any) => (
            <li key={e.id}>
              <DuelListElement
                duel={e}
                userId={user.id}
                hostRejoinDuel={hostRejoinDuel}
                rejoinDuel={rejoinDuel}
              />
            </li>
          ))}
        </ul>
          : <span>You haven't dueled yet</span>}
          
        </div>
        <div className="hostAndJoin">
          <div className="host animate__animated animate__zoomIn">
            <button onClick={handleHostDuel} className="btn">
              Host a duel
            </button>
          </div>
          <div className="join animate__animated animate__zoomIn">
            <form onSubmit={handleDuelJoin}>
              <h2>Join a duel</h2>
              <div>
              <input
                placeholder="Duel Code"
                type="text"
                name="duelCode"
                id="duelCode"
                maxLength={8}
                minLength={8}
              />
              <button type="submit">Join</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
