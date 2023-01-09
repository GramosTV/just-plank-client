import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Units } from '../../enums/units'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightHanging, faFire, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { Chart } from './Chart';
import { toast, ToastContainer } from 'react-toastify';
import { Loading } from '../elements/Loading';
import { ProfileTime } from '../elements/ProfileTime';
import ReactDOMServer from 'react-dom/server'

interface Day {
    id: string,
    numeration: number,
    weight: number,
    caloriesBurnt: number | null,
    bestPlankTime: number | string | null,
    userId: string,
    isFinished: number,
    createdAt: string,
    converted: boolean;
}
export function Days({props}:any) {
  const navigate = useNavigate();
  const {unit, id, weight} = props
  const [days, setDays] = useState<Day[]>([])
  const [dayNumeration, setDayNumeration] = useState<number>(65535)
  const [newDayNumeration, setNewDayNumeration] = useState<number>(0)
  const [dayLoading, setDayLoading] = useState(true);
  useEffect(() => {
    let isSubscribed = true;
    const fetchDays = async () => {
      const data = await fetch(`/api/days/${dayNumeration}`)
      const dataDays = await data.json()
      console.log(dataDays)
      if (dataDays.status) {
        if (isSubscribed) {
          setDays(days.concat(dataDays.days).map(item => {
            if(!item.converted) {
              let dayItem = Object.assign({}, item);
              dayItem.bestPlankTime = Number(new Date(Number(dayItem.bestPlankTime) * 1000).toISOString().substring(11, 19).replace(/\:/g,''));
              dayItem.bestPlankTime = String(dayItem.bestPlankTime).padStart(6, '0')
              dayItem.converted = true
              return dayItem;
            }
            return item
              
              
          }))
        }
      } else {
          console.log("Couldn't get days, try again later")
      }
      if (isSubscribed) {
        setDayLoading(false);
      }
    } 
    fetchDays()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return () => {isSubscribed = false}
  }, [dayNumeration, navigate])
  const getMoreDays = async () => {
    setDayNumeration(days.length > 0 ? [...days].sort((a,b) => (a.numeration > b.numeration) ? 1 : ((b.numeration > a.numeration) ? -1 : 0))[0].numeration : 65535)
  }
  const getDayTimeLeft = (date: Date) => {
    if (Math.round((date.getTime() - new Date(days[0].createdAt).getTime()) / 1000) > 86400) {
      return false
    }
    return String(Number(new Date(Math.round(86400 - (date.getTime() - new Date(days[0].createdAt).getTime()) / 1000) * 1000).toISOString().substring(11, 19).replace(/\:/g,''))).padStart(6, '0')
  }
  function startNewDay() {
    fetch('/api/days',
      {
        method: "POST",
        body: JSON.stringify({
        weight: Number(weight),
        caloriesBurnt: Number(0),
        bestPlankTime: Number(0),
        userId: id}),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(response => response.json())
    .then(data => {if (data.error) {
        console.log(data.error)
    } else if (!data.status) {
      if(data.message === 'A new day has not begun yet') {
        toast(data.message + `${". You'll have to wait:" + (ReactDOMServer.renderToStaticMarkup(<ProfileTime props={getDayTimeLeft(new Date(data.date))}/>)).replace('<p>','').replace('</p>','')}`);
      } else {
        toast(data.message)
      }
      
    }
     else {
        setNewDayNumeration(data.dayNumeration)
        navigate('/plank')
    }}  
    )
  }
  return (
    <>
    <div className="days scroll">
    <ToastContainer
    position="top-center"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />
        <button onClick={startNewDay} className='btn'>Start new day</button>
        {dayLoading ? <Loading /> : null}
        {days.map((day) => 
            <div onClick={() => day.isFinished ? navigate(`/plank/?dayNumeration=${day.numeration}`) : navigate('/plank')}key={day.id} className={day.isFinished ? 'day' : 'day inProgress'}>
                <strong>Day {day.numeration}</strong>
                <div className="day-stats">
                    <ul>
                        {day.isFinished ? null : <li><span>IN PROGRESS</span></li>}
                        {day.isFinished && day.weight ? <li><span><FontAwesomeIcon icon={faWeightHanging}/> {unit ? Math.trunc((Number(day.weight) * 2.20462262)*100)/100 + 'lbs' : Math.trunc(Number(day.weight)*100)/100 + "kg"
                        }</span></li> : null}
                        {day.caloriesBurnt ? <li><span><FontAwesomeIcon icon={faFire}/> {day.caloriesBurnt}kcal</span></li> : null}
                        {day.bestPlankTime !== "000000" ? 
                        <li><span><FontAwesomeIcon icon={faStopwatch}/> 
                        {` ${String(day.bestPlankTime).slice(0, 2) !== '00' ? Number(String(day.bestPlankTime).slice(0, 2)) + 'h' : ''}
                         ${String(day.bestPlankTime).slice(2, 4) !== '00' ? Number(String(day.bestPlankTime).slice(2, 4)) + 'm' : ''}  
                         ${String(day.bestPlankTime).slice(4, 6) !== '00' ? Number(String(day.bestPlankTime).slice(4, 6)) + 's' : ''}`} 
                        </span></li>
                        : null}
                    </ul>
                </div>
            </div>
        )}
        {days.length >= 10 && days.filter(e => e.numeration === 1).length === 0 ? <button onClick={getMoreDays} className='btn'>Load more days</button> : null}
    </div>
    <div className="charts">
      <h2>Weight</h2>
        <Chart props={{days: days.map(e => e.numeration).reverse(), axisTitle: `Weight (${unit === Units.Metric ? 'kg' : 'lbs'})`, chartData: 
        days.map(e => unit ? e.weight * 2.20462262 : e.weight).reverse()
        
        
        , label: 'Weight'}}></Chart>

        <h2>Best plank times</h2>
        <Chart props={{days: days.map(e => e.numeration).reverse(), axisTitle: 'Best Plank Time (s)', chartData: 
        days.map(e => {
          if (Number(e.bestPlankTime) > 0) return Number(String(e.bestPlankTime).slice(0, 2)) * 60 * 60 + Number(String(e.bestPlankTime).slice(2, 4)) * 60 +  Number(String(e.bestPlankTime).slice(4, 6))
          return null
        }).reverse()
        
            , label: 'Time'}}></Chart>

        <h2>Calories Burnt</h2>
        <Chart props={{days: days.map(e => e.numeration).reverse(), axisTitle: 'Calories Burnt (kcal)', chartData: days.map(e => Number(e.caloriesBurnt) > 0 ? e.caloriesBurnt : null).reverse(), label: 'Kcal'}}></Chart>
    </div>
    </>
  );
}