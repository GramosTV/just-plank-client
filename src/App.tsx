import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { LoginForm } from './components/forms/LoginForm'
import { RegisterForm } from './components/forms/RegisterForm'
import { StatsForm } from './components/forms/StatsForm';
import { Main } from './components/Main'
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import './styles/loginpage.css';
import './styles/UI.css';
import './styles/MainBox.css';
import './styles/Main.css';
import './styles/Days.css';
import './styles/Plank.css';
import './styles/Loading.css';
import './styles/Button.css';
import './styles/Profile.css';
import './styles/Friends.css';
import './styles/Duel.css';
import './styles/Docs.css';
import './styles/Settings.css';
import './styles/MainPage.css';
import './styles/Avatar.css';
import { PrivacyPolicy } from './components/docs/PrivacyPolicy';
import { TermsOfService } from './components/docs/TermsOfService';
import { EmailVerification } from './components/EmailVerification';
import {ChangePassword} from './components/ChangePassword';
import { UserProfile } from './components/UserProfile';
import { MainPage } from './components/MainPage';


function App() {
  
  return (
       <Routes>
        <Route path='*' element={<Main/>}/> 
        <Route path='/' element={<MainPage></MainPage>}/>
        <Route path='/login' element={<LoginForm/>}/> 
        <Route path='/register' element={<RegisterForm/>}/> 
        <Route path='/stats' element={<StatsForm/>}/> 
        <Route path='/privacyPolicy' element={<PrivacyPolicy></PrivacyPolicy>}/>
        <Route path='/termsOfService' element={<TermsOfService></TermsOfService>}/>
        <Route path='/emailVerification' element={<EmailVerification></EmailVerification>}/>
        <Route path='/changePassword' element={<ChangePassword></ChangePassword>}/>
        <Route path='/userProfile' element={<UserProfile></UserProfile>}/>
       </Routes>
  );
  
}

export default App;
