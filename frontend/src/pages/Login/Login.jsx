import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginTest.css';
import { useAuth } from '../../contexts/AuthContext';
import { initLogin } from "./LoginHelper";


const Login = () => {
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
    console.log('TO CALL LOGINNNN');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        //const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

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
  return (
    <>
      <div className="error" style={{ position: 'relative', zIndex: 9999 }}>
        {error && <div className="error-message" style={{
          position: 'absolute',
          width: '50%',
          left: 0,
          right: 0,
          margin: 'auto',
          marginTop: '1%'
        }}>{error}</div>}
      </div>
      <div id="back">
        <canvas id="canvas" className="canvas-back" />
        <div className="backRight"></div>
        <div className="backLeft"></div>
      </div>
      <div id="slideBox">
        <div className="topLayer">
          <div className="left">
            <div className="content">
              <img style={{ width: '10%' }}
                src="assets/images/favicon.ico"
              />
              <h2>Sign Up</h2>
              <p style={{ color: 'white' }}>Sign Up for free and start the create your own digital cards!</p>
              <form id="form-signup" onSubmit={handleSubmit}>
                <div className="form-element form-stack">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />
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
                  <button id="goLeft" className="signup off" onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(true);
                  }}>
                    Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="right">
            <div className="content">
              <img style={{ width: '10%' }}
                src="assets/images/favicon.ico"
              />
              <h2>Login</h2>
              <p>Login to your account and edit your cards from dashboard!</p>
              <form id="form-login" >
                <div className="form-element form-stack">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />
                </div>
                <div className="form-element form-submit">
                  <button id="logIn" className="login" type="submit" name="login" onClick={handleSubmit}>
                    Log In
                  </button>
                  <button id="goRight" className="login off" name="signup" onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(false);
                  }}>
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

export default Login;