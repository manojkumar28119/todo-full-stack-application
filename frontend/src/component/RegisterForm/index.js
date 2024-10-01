import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import './index.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });

  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmitSuccess = () => {
    // Redirect after successful registration
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
    setApiStatus('error');

    setTimeout(() => {
      setApiStatus('idle');
    }, 1500);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    
    // Set status to loading
    setApiStatus('loading');
    
    const url = 'https://todo-app-backend-m713.onrender.com/register';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        onSubmitSuccess();
        setFormData({
          username: '',
          password: '',
          name: '',
          email: '',
        });
        setErrorMsg('');
      } else {
        onSubmitFailure(data.error_msg);
      }
    } catch (error) {
      onSubmitFailure('Something went wrong. Please try again.');
    }
  };

  const renderInputField = (label, name, type = 'text', placeholder) => (
    <div className="input-container">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required
        className="username-input-field-reg"
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  // Dynamic button text based on API status
  const renderButtonText = () => {
    switch (apiStatus) {
      case 'loading':
        return 'Registering...';
      case 'success':
        return 'Registration Successful!';
      case 'error':
        return 'Registration Failed';
      default:
        return 'Register Now';
    }
  };

  // Dynamic button class based on API status
  const buttonClass = () => {
    switch (apiStatus) {
      case 'loading':
        return 'login-button loading';
      case 'success':
        return 'login-button success';
      case 'error':
        return 'login-button error';
      default:
        return 'login-button';
    }
  };

  return (
    <div className="login-form-container">
      <form className="form-container-reg" onSubmit={submitForm}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontWeight: '500',
          }}
        >
          <p style={{ fontSize: '18px' }}>Create your Todo</p>
          <img
            src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
            alt="website login"
            style={{ height: '25px', width: '25px', marginLeft: '5px', marginRight: '5px' }}
          />
          <p style={{ fontSize: '18px' }}>Account</p>
        </div>

        {renderInputField('Create a Username', 'username', 'text', 'Username')}
        {renderInputField('Name', 'name', 'text', 'Enter your name')}
        {renderInputField('Email', 'email', 'email', 'Enter your email')}
        {renderInputField('Create a Password', 'password', 'password', 'Password')}

        <button type="submit" className={buttonClass()} disabled={apiStatus === 'loading'}>
          {renderButtonText()}
        </button>

        <Link to="/login" style={{ marginRight: 'auto', fontSize: '14px', marginTop: '3px' }}>
          Sign in
        </Link>
        
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
