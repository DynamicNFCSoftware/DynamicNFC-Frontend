import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginTest.css';
import { useAuth } from '../../contexts/AuthContext';
import { initLogin } from "./LoginHelper";


const LoginTest = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    requestAnimationFrame(() => {
      initLogin();
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('TO CsALL LOGINNNN');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const endpoint2 = '/api/users/1';

    try {
      const response = await fetch(endpoint2, {
        //const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'GET',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(formData),
        //credentials: 'include'
      });

      const data = await response.json();
      console.log('LOGIN RESULT:', response);
      console.log('LOGIN RESULT:', data);

      if (response.ok) {
        // Login başarılı - session'ı localStorage'da sakla
        console.log('LOGIN RESULT:', data);
        if (isLogin && data.sessionId) {
          localStorage.setItem('sessionId', data.sessionId);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('accountId', data.accountId);
        } else if (!isLogin && data.accountId) {
          // Register başarılı - accountId'yi sakla
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('accountId', data.accountId);
        }


        login({
          sessionId: data.sessionId,
          email: data.email,
          accountId: data.accountId
        });

        navigate('/');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScene = async (e) => {
    e.preventDefault();
  };

  return (
    <> <div id="back">
      <canvas id="canvas" className="canvas-back" />
      <div className="backRight"></div>
      <div className="backLeft"></div>
    </div>
      <div id="slideBox">
        <div className="topLayer">
          <div className="left">
            <div className="content">
                <img style={{width: '10%'}}
                  src="assets/images/favicon.ico"
                />
              <h2>Sign Up</h2>
              <p style={{ color: 'white' }}>Sign Up for free and start the create your own digital cards!</p>
              <form id="form-signup" onSubmit={handleScene}>
                <div className="form-element form-stack">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input id="email" type="email" name="email" />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="username-signup" className="form-label">
                    Username
                  </label>
                  <input id="username-signup" type="text" name="username" />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-signup" className="form-label">
                    Password
                  </label>
                  <input id="password-signup" type="password" name="password" />
                </div>
                <div className="form-element form-checkbox">
                  <input
                    id="confirm-terms"
                    type="checkbox"
                    name="confirm"
                    defaultValue="yes"
                    className="checkbox"
                  />
                  <label htmlFor="confirm-terms">
                    I agree to the <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>
                <div className="form-element form-submit">
                  <button
                    id="signUp"
                    className="signup"
                    type="submit"
                    name="signup"
                  >
                    Sign up
                  </button>
                  <button id="goLeft" className="signup off">
                    Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="right">
            <div className="content">
                <img style={{width: '10%'}}
                  src="assets/images/favicon.ico"
                />
              <h2>Login</h2>
              <p>Login to your account and edit your cards from dashboard!</p>
              <form id="form-login" onSubmit={handleScene}>
                <div className="form-element form-stack">
                  <label htmlFor="username-login" className="form-label">
                    Username
                  </label>
                  <input id="username-login" type="text" name="username" />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-login" className="form-label">
                    Password
                  </label>
                  <input id="password-login" type="password" name="password" />
                </div>
                <div className="form-element form-submit">
                  <button id="logIn" className="login" type="submit" name="login">
                    Log In
                  </button>
                  <button id="goRight" className="login off" name="signup">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div></>
  );
};

export default LoginTest;
