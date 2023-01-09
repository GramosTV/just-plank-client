import { faDiscord, faInstagram, faRedditAlien, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faArrowDown, faArrowsSpin, faBrain, faDumbbell, faEnvelope, faGears, faPerson, faScaleBalanced, faShieldHalved, faShieldVirus, faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { LegacyRef, RefObject, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Loading } from './elements/Loading';

export function MainPage() {
    const navigate = useNavigate()
    const cardsRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        let isSubscribed = true;
        async function fetchUser() {
          try {
            const response = await fetch(`/api/user`);
            const json = await response.json();
            if (json.status && json.user.emailVerified === 0) {
              if (isSubscribed) {
                    setLoading(false)
                  }
                  navigate('/login')
            } else if (json.status && json.user.statsSet === 0) {
              if (isSubscribed) {
                    setLoading(false)
                  }
              navigate("/stats");
            } else if (json.status) {
              if (isSubscribed) {
                    setLoading(false)
                  }
              navigate('/days');
            } else {
              if (isSubscribed) {
                    setLoading(false)
                  }
              return;
            }
          } catch (e) {
            if (isSubscribed) {
                    setLoading(false)
                  }
            console.error(e);
          }
        }
        fetchUser();
        return () => {
          isSubscribed = false;
        };
      }, [navigate]);
    if (loading) return <div className="fill"><Loading /></div>
  return (
      <>
      <div className="mainPage">
        <div className="bgc"></div>
        <div className="main">
            <h1 className="animate__animated animate__backInDown">Just Plank</h1>
            <div className="img animate__animated animate__zoomIn"></div>
            <h2>Start Planking Today</h2>
            <div className="btns"><button className='btn' onClick={() => navigate('/register')}>Register</button><button className='btn' onClick={() => navigate('/login')}>Login</button></div>
            <FontAwesomeIcon icon={faArrowDown} onClick={() => cardsRef.current ? cardsRef.current.scrollIntoView() : null}/>
        </div>
      </div>
      <h2 className='introH2' ref={cardsRef}>What is Just Plank?</h2>
      <p className='intro'>Just Plank is a fitness app that will help you with planking everyday which can improve your physical and mental health in many ways. It's made for tracking your progress, motivating you, and making sure that you're doing planks the right way. It sounds simple, but Just Plank is also a community of people that unite to achieve their dream shape together. This means that the application has social features built-in too like inviting friends, seeing their progress, sharing your profile, and having real-time planking duels. All of this is <b>completely free without any paywalls.</b> What are you waiting for? Join us and begin your planking adventure!</p>
      <h2 className='benefits'>What are the benefits of daily planking?</h2>
    <div className="mainPageCardsContainer">
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faDumbbell}/>
            </div>
            <div className="content">
            <h2>Improved Core Strength</h2>
            <p>When doing a plank your abdominal muscles are strengthening as well as your other muscle groups. Combined with a healthy diet and fat burning exercises planking will quickly effect in noticeable changes especially on your belly.</p>
            </div>
        </div>
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faPerson}/>
            </div>
            <div className="content">
            <h2>Improved Posture</h2>
            <p>Proper posture is important since it can prevent injuries and reduce back pain. it also displays self-assurance and confidence which is considered very attractive.</p>
            </div>
        </div>
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faArrowsSpin}/>
            </div>
            <div className="content">
            <h2>Improved Metabolism</h2>
            <p>Strong muscles make you burn more calories when exercising, when you're at rest, and even while you're sleeping. Joined together with a healthy diet planking can be one of the easiest ways to lose weight.</p>
            </div>
        </div>
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faSmileBeam}/>
            </div>
            <div className="content">
            <h2>Improved Well-being</h2>
            <p>Planking like any other exercise improves your mood by releasing endorphins into your body. It's also a great way to relieve stress too which can be harmful for your organism in the long term.</p>
            </div>
        </div>
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faShieldVirus}/>
            </div>
            <div className="content">
            <h2>Improved Immunity</h2>
            <p>Planking increases the circulation of immune cells in your body. It's also gets your body temperature hotter both during and after the exercise. In effect, it prevents bacteria from growing and helps your body to address an infection.</p>
            </div>
        </div>
        <div className="serviceBox">
            <div className="icon">
            <FontAwesomeIcon icon={faScaleBalanced}/>
            </div>
            <div className="content">
            <h2>Improved Balance</h2>
            <p>Planking is building up your core muscles that are responsible for the way your body carries itself which can have a significant impact on your body balance.</p>
            </div>
        </div>
    </div>
    <footer>
        <div className="container">
            <div className="sec aboutus">
                <h2>About us</h2>
                <p>
                    Just Plank is a free fitness app made to help you plank daily. Challenge yourself and your friends, track your progress and see how long can your planking time get!
                </p>
                <ul className="sci">
                <li><a href='https://discord.com/invite/XMQnsDWJRs' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord}/></a></li>
                <li><a href='https://www.instagram.com/justplankapp/' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram}/></a></li>
                <li><a href='https://twitter.com/justplankapp' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTwitter}/></a></li>
                <li><a href='https://www.youtube.com/channel/UCV9JvxrPd8fcNwDMkv_rv1A' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube}/></a></li>
                <li><a href='https://www.tiktok.com/@justplankapp' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTiktok}/></a></li>
                <li><a href='https://www.reddit.com/r/justplank' target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faRedditAlien}/></a></li>
            </ul>
            </div>
            <div className="sec quickLinks">
                <h2>Quick Links</h2>
                <ul>
                    <li><span onClick={() => {navigate('/privacyPolicy')}}>Privacy Policy</span></li>
                    <li><span onClick={() => {navigate('/termsOfService')}}>Terms Of Service</span></li>
                </ul>
            </div>
            <div className="sec contact">
                <h2>Contact Info</h2>
                <ul className="info">
                    <li>
                        <span><FontAwesomeIcon icon={faEnvelope}/></span>
                        <p><a href="mailto:justplankapp@gmail.com">justplankapp@gmail.com</a></p>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
    <div className="copyrightText">
        <p>Copyright &copy; 2022 Just Plank. All rights reserved.</p>
    </div>
    </>
  );
}

