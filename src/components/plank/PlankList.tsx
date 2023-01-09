// @ts-nocheck
import React, {MouseEvent, MouseEventHandler, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Units } from '../../enums/units'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightHanging, faFire, faStopwatch, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Chart } from './Chart';
import { toast, ToastContainer } from 'react-toastify';
import { Loading } from '../elements/Loading';
import { Genders } from '../../enums/genders';


interface Plank {
    id: string,
    dayId: string,
    plankTime: string,
    caloriesBurnt: number,
    numeration: number,
}
export function PlankList(props:any) {
  const navigate = useNavigate();
  const {unit, dayId, newPlankNumeration, setNewPlankNumeration, dayNumeration, isFinished, setPlankingTimes, setBestUserTime, plankFlag} = props.props
  const [planks, setPlanks] = useState<Plank[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadMoreBtn, setLoadMoreBtn] = useState<boolean>(false)
  const [plankNumeration, setPlankNumeration] = useState<number>(65535)
  useEffect(() => {
      if (newPlankNumeration) {
    (async () => {
      const data = await fetch(`/api/plank/${dayId}&${newPlankNumeration}`)
      let dataPlank = await data.json()
      if (dataPlank.status) {
        dataPlank.plank.plankTime = Number(new Date(Number(dataPlank.plank.plankTime) * 1000).toISOString().substring(11, 19).replace(/\:/g,''))
          dataPlank.plank.plankTime = String(dataPlank.plank.plankTime).padStart(6, '0')
          setPlanks([dataPlank.plank, ...planks])
      } else {
          console.log("Couldn't get plank, try again later")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }}, [plankFlag])
  useEffect(() => {
    if(dayId) {
      (async () => {
        setLoading(true)
        const data = await fetch(`/api/planks/${dayId}&${plankNumeration}`)
        const dataPlanks = await data.json()
        if (dataPlanks.status && dataPlanks.planks.length > 0) {
          setLoadMoreBtn(true)
            setPlanks(planks.concat(dataPlanks.planks).map(item => {
                let plankItem = Object.assign({}, item);
                plankItem.plankTime = Number(new Date(Number(plankItem.plankTime) * 1000).toISOString().substring(11, 19).replace(/\:/g,''));
                    plankItem.plankTime = String(plankItem.plankTime).padStart(6, '0')
                return plankItem;
            }))
            setLoading(false)
            if (dataPlanks.planks.length < 10) {
              setLoadMoreBtn(false)
            }
            console.log(dataPlanks.planks.length)
        } else if (!dataPlanks.status) {
          console.log("No planks found")
          setLoading(false)
        } else {
          setLoadMoreBtn(false)
          console.log("No planks found")
          setLoading(false)
        }
      })()
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plankNumeration, dayId])
  const getMorePlanks = async () => {
    setPlankNumeration(planks.length > 0 ? [...planks].sort((a,b) => (a.numeration > b.numeration) ? 1 : ((b.numeration > a.numeration) ? -1 : 0))[0].numeration : 65535)
  }
  const handleDelete = async function (e: MouseEvent<HTMLElement>) {
      const elementNumeration = e.currentTarget.parentNode.id
      setPlanks([...planks].filter(e => {
        if (Number(e.numeration) === Number(elementNumeration)) {
          return false
        } else {
          return true
        }
      })
      )
      await fetch('/api/plank',
      {
        method: "DELETE",
        body: JSON.stringify({
        dayNumeration: dayNumeration,
        dayId,
        plankNumeration: elementNumeration,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      ).then(response => response.json())
      .then(() => {
    fetch('/api/day',
    {
      method: "PUT",
      body: JSON.stringify({
        weight: 0,
        dayNumeration: dayNumeration,
        finish: 0,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  })
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
  if (loading) return <Loading/>
  return (
    <>
    <div className={'planks scroll animate__animated animate__zoomIn'}>
    {planks.length === 0 ?
    isFinished ? <span>This day was a good rest.</span>
    : <span>What are you waiting for? Let's Plank!</span>
    : planks.map((plank, i) =>
            <div key={plank.id} id={plank.numeration} className={(
              newPlankNumeration === plank.numeration ? 'plank animate__animated animate__zoomIn' : 'plank') + (plank.duel ? ' fromDuel' : '')
            }>
                <strong>Plank {'#' + plank.numeration}{plank.duel ? ' (DUEL)' : null}</strong>
                <div className={isFinished ? "day-stats" : "day-stats deleteBtnMargin"}>
                    <ul>
                        <li><span><FontAwesomeIcon icon={faFire}/> {plank.caloriesBurnt}kcal</span></li>
                        <li><span><FontAwesomeIcon icon={faStopwatch}/> 
                        {` ${String(plank.plankTime).slice(0, 2) !== '00' ? Number(String(plank.plankTime).slice(0, 2)) + 'h' : ''}
                         ${String(plank.plankTime).slice(2, 4) !== '00' ? Number(String(plank.plankTime).slice(2, 4)) + 'm' : ''}  
                         ${String(plank.plankTime).slice(4, 6) !== '00' ? Number(String(plank.plankTime).slice(4, 6)) + 's' : ''}`} 
                        </span>
                        </li>
                    </ul>
                </div>
                {isFinished ? null : <button className='deletePlankBtn' onClick={handleDelete}><FontAwesomeIcon icon={faTrashCan}/></button>}
            </div>
        )}
        {/* {loadMoreBtn ? <button onClick={getMorePlanks}>Load more planks</button> : null} */}
    </div>
    </>
  );
}