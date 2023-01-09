// @ts-nocheck
import { faArrowLeft, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "@ramonak/react-progress-bar";
import React, { useEffect, useRef, useState } from "react";
import Timer from "react-compound-timerv2/build";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Genders } from "../../enums/genders";
import { Day } from "../../interfaces/day";
import { User } from "../../interfaces/user";
import { Loading } from "../elements/Loading";
import { FormWarning } from "../forms/FormWarning";
import { PlankList } from "./PlankList";
import { toast, ToastContainer } from "react-toastify";
import ReactNoSleep from "react-no-sleep";
import { ProfileTime } from "../elements/ProfileTime";
interface TimeBar {
  text: string;
  color: string;
  time: number;
}
interface Quote {
  text: string;
  author: string;
}
export function Plank({ props }: any) {
  const [width, setWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const [formWarning, setFormWarning] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const weightInput = useRef<HTMLInputElement>(null);
  const { unit, weight } = props;
  const [day, setDay] = useState<Day>({
    id: "",
    numeration: 0,
    weight: 0,
    caloriesBurnt: 0,
    bestPlankTime: 0,
    userId: "",
    isFinished: 0,
    createdAt: "",
  });

  const [plankingTimes, setPlankingTimes] = useState<TimeBar[]>([]);
  const navigate = useNavigate();
  const [bestUserTime, setBestUserTime] = useState<number>(0);
  const [quoteAnim, setQuoteAnim] = useState<boolean>(false);
  const [timeState, setTimeState] = useState<boolean>(false);
  const [newPlankNumeration, setNewPlankNumeration] = useState<number>(0);
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      text: "",
      author: "",
    },
  ]);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const Stime = useRef<number>(0);
  const Mtime = useRef<number>(0);
  const Htime = useRef<number>(0);
  const [unitInput, setUnitInput] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [daySubmitLoading, setDaySubmitLoading] = useState(false);
  const [plankFlag, setPlankFlag] = useState<boolean>(false);
  useEffect(() => {
    let isSubscribed = true;
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`);
        const json = await response.json();
        if (json.status && json.user.statsSet === 0) {
          navigate("/stats");
        } else if (json.status) {
          const dayQuery = searchParams.get("dayNumeration");
          dayQuery
            ? await fetch(`/api/day/${dayQuery}`)
                .then((r) => r.json())
                .then((r) => {if (isSubscribed) {setDay(Boolean(r.day) ? {...r.day, date: r.date} : day)}})
            : await fetch(`/api/latestDay`)
                .then((r) => r.json())
                .then((r) => {if (isSubscribed) {setDay(Boolean(r.day) ? {...r.day, date: r.date} : day)}});
                let plankTimes: TimeBar[];
        const maleTime = await fetch(`/api/averagePlankTime/${Genders.Male}`)
          .then((r) => r.json())
          .then((r) => r.averagePlankTime);
        const femaleTime = await fetch(
          `/api/averagePlankTime/${Genders.Female}`
        )
          .then((r) => r.json())
          .then((r) => r.averagePlankTime);
        const userTime = await fetch(`/api/bestUserPlankTime`)
          .then((r) => r.json())
          .then((r) => r.bestPlankTime);
          if (isSubscribed) {
            setBestUserTime(userTime);
          }
        plankTimes = [
          {
            text: "Average Male Planking Time",
            color: "#0492C2",
            time: maleTime || 106,
          },
          {
            text: "Average Female Planking Time",
            color: "#ff66cc",
            time: femaleTime || 90,
          },
        ];
        if (userTime) {
          plankTimes.push({
            text: "Your Best Planking Time",
            color: "#26f126",
            time: userTime,
          });
        }

        plankTimes.sort((a, b) =>
          a.time > b.time ? -1 : b.time > a.time ? 1 : 0
        );
        if (isSubscribed) {
          setPlankingTimes(plankTimes);
        }
          if (isSubscribed) {
            setUnitInput(Boolean(json.user.unit));
          }
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
    return () => {
      isSubscribed = false;
    };
  }, [navigate]);

  const addNewPlank = async function() {
    await fetch("/api/plank", {
      method: "POST",
      body: JSON.stringify({
        dayNumeration: day.numeration,
        dayId: day.id,
        plankTime: Stime.current + Mtime.current + Htime.current,
        caloriesBurnt: Math.round(
          (Stime.current / 60 + Mtime.current / 60 + Htime.current / 60) *
            (unit ? 0.05733 * weight : 0.026 * weight)
        ),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else if (!data.status) {
          toast(data.message);
        } else {
          setNewPlankNumeration(data.plankNumeration);
          setPlankFlag(!plankFlag)
        }
      })
      .then(() => {
        fetch("/api/day", {
          method: "PUT",
          body: JSON.stringify({
            weight: 0,
            dayNumeration: day.numeration,
            finish: 0,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
      let plankTimes: TimeBar[];
        const maleTime = await fetch(`/api/averagePlankTime/${Genders.Male}`)
          .then((r) => r.json())
          .then((r) => r.averagePlankTime);
        const femaleTime = await fetch(
          `/api/averagePlankTime/${Genders.Female}`
        )
          .then((r) => r.json())
          .then((r) => r.averagePlankTime);
        const userTime = await fetch(`/api/bestUserPlankTime`)
          .then((r) => r.json())
          .then((r) => r.bestPlankTime);
            setBestUserTime(userTime);
          
        
        plankTimes = [
          {
            text: "Average Male Planking Time",
            color: "#0492C2",
            time: maleTime || 106,
          },
          {
            text: "Average Female Planking Time",
            color: "#ff66cc",
            time: femaleTime || 90,
          },
        ];
        if (userTime) {
          plankTimes.push({
            text: "Your Best Planking Time",
            color: "#26f126",
            time: userTime,
          });
        }

        plankTimes.sort((a, b) =>
          a.time > b.time ? -1 : b.time > a.time ? 1 : 0
        );
        setPlankingTimes(plankTimes);
  
  }

  function getRandomInt(max) {
    let randomNum = Math.floor(Math.random() * max);
    if (randomNum === quoteIndex || randomNum === 0) {
      return ++randomNum;
    } else {
      return randomNum;
    }
  }
  useEffect(() => {
    (async function fetchQuotes() {
      await fetch("https://type.fit/api/quotes")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setQuotes(data);
        })
        .catch(function (err) {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
    let interval;
    let styleTimeout;
    if (timeState) {
      interval = setInterval(() => {
        if (
          Stime.current + Mtime.current * 60 + Htime.current * 60 * 60 >=
          bestUserTime / 2
        ) {
          setQuoteIndex(getRandomInt(quotes.length + 1));
          setQuoteAnim(true);
          styleTimeout = setTimeout(() => {
            setQuoteAnim(false);
          }, 8500);
        }
      }, 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(styleTimeout);
      };
    } else {
      setQuoteIndex(0);
      clearInterval(interval);
      clearTimeout(styleTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeState]);

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > 450 && !unitInput) {
      setFormWarning(`You're too heavy`);
    } else if (Number(e.target.value) > 992 && unitInput) {
      setFormWarning(`You're too heavy`);
    } else if (
      String(e.target.value).substring(String(e.target.value).indexOf("."))
        .length > 3
    ) {
      setFormWarning(`Enter only 2 numbers after the decimal point`);
      return;
    } else {
      setFormWarning(``);
    }
  };
  const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    const weight = e.currentTarget.elements.weight.value;
    setDaySubmitLoading(true)
    try {
      const setStats = await fetch("/api/day", {
        method: "PUT",
        body: JSON.stringify({
          weight: unit ? Number(weight) / 2.20462262 : weight,
          dayNumeration: day.numeration,
          finish: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const statsData = await setStats.json();
      if (statsData.status) {
        setFormError("");
        navigate("/days");
      } else {
        setFormError("Failed to add day. Please try again later");
      }
    } catch (e) {
      console.error(e);
    }
    setDaySubmitLoading(false)
  };
  const getDayTimeLeft = (date: Date) => {
    if (Math.round((date.getTime() - new Date(day.createdAt).getTime()) / 1000) > 86400) {
      return false
    }
    return String(Number(new Date(Math.round(86400 - (date.getTime() - new Date(day.createdAt).getTime()) / 1000) * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')
  }
  if (day.id === "") return <Loading></Loading>;
  return (
    <>
      <ReactNoSleep>
        {({ isOn, enable, disable }) => (
          <>
            {day.isFinished ? (
              <div className="dayLabel">
                <div className="dayLabelContainer animate__animated animate__backInLeft">
                  <strong className="pointer" onClick={() => navigate("/days")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Day {day.numeration}
                  </strong>
                </div>
                <PlankList
                  props={{
                    unit: unit,
                    dayId: day.id,
                    newPlankNumeration,
                    setNewPlankNumeration,
                    dayNumeration: day.numeration,
                    isFinished: day.isFinished,
                    setPlankingTimes,
                    setBestUserTime
                  }}
                ></PlankList>
              </div>
            ) : (
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
                <div className="stopwatch animate__animated animate__zoomIn">
                  <div className="dayLabelContainer animate__animated animate__backInLeft">
                    <strong
                      className="pointer"
                      onClick={() => navigate("/days")}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Day {day.numeration}
                    </strong>
                  </div>
                  {quoteIndex && bestUserTime ? (
                    <span
                      className={`quote animate__animated ${
                        quoteAnim ? "quote animate__fadeIn" : "animate__fadeOut"
                      }`}
                    >
                      "{quotes[quoteIndex].text}"{" "}
                      {` - ${
                        quotes[quoteIndex].author
                          ? quotes[quoteIndex].author
                          : "Unknown Author"
                      }`}
                    </span>
                  ) : (
                    <span className="quote"></span>
                  )}
                  <Timer
                    initialTime={0}
                    startImmediately={false}
                    timeToUpdate={10}
                  >
                    {({ start, resume, pause, stop, reset, timerState }) => (
                      <React.Fragment>
                        <div>
                          <Timer.Hours
                            formatValue={(value) => {
                              if (value > 0 || value < 60) {
                                Htime.current = value * 60 * 60;
                              }
                              return String(value).length < 2
                                ? `0${value}`
                                : value;
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
                                : value;
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
                                : value;
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
                          {timeState ? (
                            <button
                              className="btn"
                              onClick={() => {
                                disable();
                                stop();
                                setTimeState(false);
                                addNewPlank();
                              }}
                            >
                              Stop
                            </button>
                          ) : (
                            <button
                              className="btn"
                              onClick={() => {
                                enable();
                                start();
                                reset();
                                setTimeState(true);
                                Stime.current = 0;
                                Mtime.current = 0;
                                Htime.current = 0;
                              }}
                            >
                              Start
                            </button>
                          )}
                        </div>
                        <div className="tip">
                          <FontAwesomeIcon icon={faQuestion} />
                          <div className="content">
                            <div className="triangle"></div>
                          </div>
                        </div>
                        {plankingTimes.length === 0 ? (
                          <Loading></Loading>
                        ) : null}
                        {plankingTimes.map((e) => {
                          return (
                            <div
                              key={e.color}
                              className="timeBar animate__animated animate__zoomIn"
                            >
                              <h3>{e.text}</h3>
                              <ProgressBar
                                completed={
                                  Stime.current +
                                    Mtime.current +
                                    Htime.current >
                                  e.time
                                    ? e.time
                                    : Stime.current +
                                      Mtime.current +
                                      Htime.current
                                }
                                bgColor={e.color}
                                labelColor="#111111"
                                maxCompleted={e.time}
                                width={width > 992 ? "360px" : "280px"}
                                customLabel={
                                  Stime.current +
                                    Mtime.current +
                                    Htime.current >
                                  e.time
                                    ? e.time + "s"
                                    : Stime.current +
                                      Mtime.current +
                                      Htime.current +
                                      "s"
                                }
                                transitionTimingFunction="linear"
                              />
                            </div>
                          );
                        })}
                      </React.Fragment>
                    )}
                  </Timer>
                </div>
                <div className="plankList-container animate__animated animate__zoomIn">
                  <PlankList
                    props={{
                      unit: unit,
                      dayId: day.id,
                      newPlankNumeration,
                      setNewPlankNumeration,
                      dayNumeration: day.numeration,
                      setPlankingTimes,
                    setBestUserTime,
                    plankFlag
                    }}
                  ></PlankList>
                  <form className="form daySubmit" onSubmit={handleSubmit}>
                    <span>
                      {getDayTimeLeft(new Date(day.date)) ? "If you're not going to plank anymore today, submit your day. Notice that you won't be able to start a new day in the next:" : null}
                      {getDayTimeLeft(new Date(day.date)) ? <ProfileTime props={getDayTimeLeft(new Date(day.date))}/> : null}
                      
                    </span>
                    <div className="input-container ic2 numberSmall">
                      <input
                        ref={weightInput}
                        id="weight"
                        className="input"
                        type="number"
                        placeholder=" "
                        name="weight"
                        step=".01"
                        min={1}
                        max={unit ? 992 : 450}
                        onChange={handleWeightChange}
                        required
                      />
                      <div className="cut cut" />
                      <label htmlFor="weight" className="placeholder">
                        Weight({unitInput ? "lbs" : "kg"})
                      </label>
                    </div>
                    <FormWarning formWarning={formWarning}></FormWarning>
                    <FormWarning formWarning={formError}></FormWarning>

                    <button type="submit" className={daySubmitLoading ? "submit loading" : "submit"}>
                      {daySubmitLoading ? <Loading /> : "Submit Day"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </>
        )}
      </ReactNoSleep>
    </>
  );
}
