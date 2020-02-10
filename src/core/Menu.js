import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#ff9933' };
  } else {
    return { color: '#e8f5f7' };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link className='nav-link' style={isActive(history, '/')} to='/'>
          Home
        </Link>
      </li>

      {!isAuthenticated() && (
        <Fragment>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signin')}
              to='/signin'
            >
              SignIn
            </Link>
          </li>

          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signup')}
              to='/signup'
            >
              SignUp
            </Link>
          </li>
        </Fragment>
      )}

      {isAuthenticated() && (
        <Fragment>
          <li className='nav-item'>
            <span
              className='nav-link'
              style={{ cursor: 'pointer', color: '#e8f5f7' }}
              onClick={() => signout(() => history.push('/'))}
            >
              Sign Out
            </span>
          </li>

          <li className='nav-item'>
            <Link
              to={`/user/${isAuthenticated().user._id}`}
              className='nav-link'
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
        </Fragment>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
