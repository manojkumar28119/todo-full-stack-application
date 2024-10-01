import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import './index.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const navigate = useNavigate();

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (data) => {
    Cookies.set('jwt_token', data.jwtToken, { expires: 30 });
    Cookies.set('user_id', data.user_id, { expires: 30 });
    Cookies.set('username', data.username, { expires: 30 });

    // Set status to success
    setApiStatus('success');

    setTimeout(() => {
      navigate('/');
    }, 1000); // Redirect after 1.5 seconds to allow the button state to show success
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);

    // Set status to error
    setApiStatus('error');

    setTimeout(() => {
      setApiStatus('idle'); // Reset button after showing error
    }, 1500);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };

    // Set status to loading
    setApiStatus('loading');

    const url = 'https://todo-app-backend-m713.onrender.com/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        onSubmitSuccess(data);
      } else {
        onSubmitFailure(data.error_msg);
      }
    } catch (error) {
      onSubmitFailure('Something went wrong. Please try again.');
    }
  };

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  // Dynamic button text based on API status
  const renderButtonText = () => {
    switch (apiStatus) {
      case 'loading':
        return 'Logging in...';
      case 'success':
        return 'Login Successful!';
      case 'error':
        return 'Login Failed';
      default:
        return 'Login';
    }
  };

  // Dynamic button class based on API status
  const buttonClass = () => {
    switch (apiStatus) {
      case 'loading':
        return 'login-button loading'; // You can style this in your CSS for a spinner or loading effect
      case 'success':
        return 'login-button success'; // Green color for success
      case 'error':
        return 'login-button error'; // Red color for failure
      default:
        return 'login-button';
    }
  };

  return (
    <div className="login-form-container">
      <img
        src="https://play-lh.googleusercontent.com/e8JI4GkbG9t64yLors6g97nUrYg1TavdwTd28s2p8cxWxFj-CTrB7TgJDK_Qu3wnMzwe"
        className="login-image"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontWeight: '500',
          }}
        >
          <p style={{ fontSize: '18px' }}>Sign into your</p>
          <img
            src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
            alt="website login"
            style={{ height: '25px', width: '25px', marginLeft: '5px', marginRight: '5px' }}
          />
          <p style={{ fontSize: '18px' }}>Account</p>
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="username-input-field"
            value={username}
            onChange={handleChangeUsername}
            placeholder="Username"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="password-input-field"
            value={password}
            onChange={handleChangePassword}
            placeholder="Password"
          />
        </div>

        <button type="submit" className={buttonClass()} disabled={apiStatus === 'loading'}>
          {renderButtonText()}
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <Link to="/register" style={{ marginRight: 'auto', fontSize: '14px', marginTop: '3px' }}>
          Sign up
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
