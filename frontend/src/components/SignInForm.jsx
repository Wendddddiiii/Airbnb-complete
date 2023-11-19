import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInForm = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const Login = async () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Please enter both email and password.');
      return;
    }
    const url = 'http://localhost:5005/user/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data.token !== null) {
      alert('Logged in successfully!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      props.setToken(data.token);
      navigate('/dashboard');
    } else {
      alert('Failed to log in');
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  return (
    <div>
      <div>
        Email:
        <input type="text" value={email} onChange={handleEmailChange} placeholder="Email" name="email" />
      </div>
      <div>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" name="password" />
      </div>
      <button onClick={Login} type="submit" className="btn btn-warning">Submit</button>
      <button onClick={() => navigate('/')} type="button" className="btn btn-warning">Cancel</button>

    </div>
  );
};

export default SignInForm;
