import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './Signup.css'; // 필요한 CSS 파일을 가져옵니다.
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const API_KEY = 'a043d2d0050948ccaa4a35d1161a9a90'; // OpenCage API 키를 여기에 입력합니다.

function Signup() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    country: '',
    residence: '',
    job: '',
    job_detail: '',
    interests: '',
    club: '',
    latitude: '',
    longitude: '',
    email: '',
    password: ''
  });

  const [action, setAction] = useState("Sign Up");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setAction(""); // Hide other forms when showing forgot password
  };

  const handleFormSwitch = (formType) => {
    setFormData({
      name: '',
      group: '',
      country: '',
      residence: '',
      job: '',
      job_detail: '',
      interests: '',
      club: '',
      latitude: '',
      longitude: '',
      email: '',
      password: ''
    });
    setAction(formType);
    setShowForgotPassword(false); // Hide forgot password when switching forms
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setAction("Login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === "Sign Up") {
        if (formData.residence) { // residence가 빈 값이 아닌 경우에만 OpenCage API 호출
          const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${formData.residence}&key=${API_KEY}`);
          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            formData.latitude = lat;
            formData.longitude = lng;
          }
        }
        await axios.post('/api/signup', formData);
        alert('User added successfully');
        handleFormSwitch("Login"); // 성공적으로 등록되면 로그인 탭으로 전환 및 입력 데이터 초기화
      } else {
        const response = await axios.post('/api/login', { email: formData.email, password: formData.password });
        if (response.status === 200) {
          setAuth({ isAuthenticated: true, user: response.data.user });
          alert('Logged in successfully');
          navigate('/dashboard'); // 로그인 성공 시 대시보드로 이동
        }
      }
    } catch (error) {
      console.error("There was an error adding the user!", error);
      if (action === "Login") {
        alert('Invalid email or password');
      }
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">
          {showForgotPassword ? "Forgot Password" : action}
        </div>
        <div className="underline"></div>
      </div>

      <form className="inputs" onSubmit={handleSubmit}>
        {showForgotPassword ? (
          <>
            <div className='input'>
              <img src={email_icon} alt=""/>
              <input type="email" name="email" placeholder='Enter your Email' onChange={handleChange} />
            </div>
            <div className='submit-container'>
              <div className="submit" onClick={() => {/* Handle send password reset email logic here */}}>
                Send
              </div>
              <div className="submit gray" onClick={handleBackToLogin}>
                Back
              </div>
            </div>
          </>
        ) : (
          <>
            {action === "Login" ? (
              <>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="email" name="email" placeholder='Email Id' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={password_icon} alt=""/>
                  <input type="password" name="password" placeholder='Password' onChange={handleChange} />
                </div>
                <div className='forgot-password' onClick={handleForgotPasswordClick}>
                  Lost Password? <span>Click Here</span>
                </div>
              </>
            ) : (
              <>
                <div className='input'>
                  <img src={user_icon} alt=""/>
                  <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="group" placeholder='Group' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="country" placeholder='Country' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="residence" placeholder='Residence' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="job" placeholder='Job' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="job_detail" placeholder='Job Details' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="interests" placeholder='Interests' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="text" name="club" placeholder='Club' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={email_icon} alt=""/>
                  <input type="email" name="email" placeholder='Email Id' onChange={handleChange} />
                </div>
                <div className='input'>
                  <img src={password_icon} alt=""/>
                  <input type="password" name="password" placeholder='Password' onChange={handleChange} />
                </div>
              </>
            )}
          </>
        )}
        {!showForgotPassword && (
          <div className='submit-container'>
            <button type="submit" className="submit">{action}</button>
            <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => handleFormSwitch(action === "Sign Up" ? "Login" : "Sign Up")}>
              {action === "Sign Up" ? "LogIn" : "Sign Up"}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Signup;
