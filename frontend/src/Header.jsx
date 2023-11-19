import React from 'react';
import { useNavigate } from 'react-router-dom';
const Header = (props) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const logoStyle = {
    maxWidth: windowWidth <= 480 ? '100px' : windowWidth <= 768 ? '150px' : '180px',
    height: 'auto'
  };
  const Logout = () => {
    localStorage.removeItem('token');
    props.setToken(null);
    navigate('/');
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    flexWrap: 'wrap'
  };

  const headerLeftRightStyle = {
    flex: '1 1 auto',
    minWidth: '0'
  };

  const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  };

  const btnGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
  };

  const btnStyle = {
    margin: '5px',
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    cursor: 'pointer',
  };
  return (
    <div style={headerStyle}>
      <div style={headerLeftRightStyle}>
      <button style={btnStyle} onClick={() => navigate('/')}>
        <img style={logoStyle} src="/images/logo.png" alt="Logo" />
      </button>
      </div>
      <div style={headerRightStyle}>
        {props.token === null
          ? <div style={btnGroupStyle}>
              <button style={btnStyle} onClick={() => navigate('/login')}>Log in</button>
              <button style={btnStyle} onClick={() => navigate('/register')}>Sign up</button>
            </div>
          : <div style={btnGroupStyle}>
              <button style={btnStyle} onClick={Logout}>Log out</button>
              <button style={btnStyle} onClick={() => navigate('/')}>All Listings</button>
              <button style={btnStyle} onClick={() => navigate('/showAllListing')}>Hosted Listings</button>
            </div>
        }
      </div>
    </div>
  );
};

export default Header;
