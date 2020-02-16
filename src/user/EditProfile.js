import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { read, update, updateUser } from './apiUser';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../images/profile.jpeg';
import '../App.css';

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0,
      about: ''
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: '',
          about: data.about
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 500000) {
      this.setState({
        error: 'File size should be less than 500kb',
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: 'Name is required', loading: false });
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: 'A valid Email is required',
        loading: false
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: 'Password must be at least 6 characters long',
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password, about) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='exampleInputName2'>Name</label>
        <input
          onChange={this.handleChange('name')}
          type='text'
          className='form-control'
          id='exampleInputName2'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='exampleInputEmail1'>Email</label>
        <input
          onChange={this.handleChange('email')}
          type='email'
          className='form-control'
          id='exampleInputEmail1'
          value={email}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='exampleInputPassword1'>Password</label>
        <input
          onChange={this.handleChange('password')}
          type='password'
          className='form-control'
          id='exampleInputPassword1'
          value={password}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='text-muted'></label>
        <textarea
          onChange={this.handleChange('about')}
          type='text'
          className='form-control'
          id='about'
          value={about}
        />
      </div>

      <button onClick={this.clickSubmit} className='btn btn-raised btn-warning'>
        Update
      </button>
    </form>
  );
  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profile</h2>
        <div
          className='alert alert-warning'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
          <button
            type='button'
            className='close'
            data-dismiss='alert'
            aria-label='Close'
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>

        {loading ? (
          <div className='jumbotron text-center'>
            <div className='lds-hourglass'></div>
          </div>
        ) : (
          ''
        )}

        <img
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        />

        {this.signupForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
