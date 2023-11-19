import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const Register = async () => {
    if (email.trim() === '' || name.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please re-enter them.');
      return;
    }

    const url = 'http://localhost:5005/user/auth/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });
    const data = await response.json();
    if (data.token !== null) {
      alert('Registered successfully!');
      localStorage.setItem('token', data.token);
      props.setToken(data.token);
      navigate('/dashboard');
    } else {
      alert('Failed to register');
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  return (
    <div>
      <div>
        Email:
        <input type="text" value={email} onChange={handleEmailChange} name="email" />
      </div>
      <div>
        Name:
        <input type="text" value={name} onChange={handleNameChange} name="name" />
      </div>
      <div>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} name="password" />
      </div>
      <div>
        Confirm Password:
        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} name="confirmPassword"/>
      </div>
      <button onClick={Register} type="submit" className="btn btn-warning">Submit</button>
      <button onClick={() => navigate('/')} type="button" className="btn btn-warning">Cancel</button>
    </div>
  );
};

export default SignUpForm;
