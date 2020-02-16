import React, { Component } from 'react';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      open: false
    };
  }

  handleChange = name => event => {
    this.setState({ error: '' });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };

    signup(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          error: '',
          name: '',
          email: '',
          password: '',
          open: true
        });
      }
    });
  };

  signupForm = (name, email, password) => (
    <form>
      <div className='form-group'>
        <label className='bmd-label-floating' htmlFor='exampleInputName2'>
          Name
        </label>
        <input
          onChange={this.handleChange('name')}
          type='text'
          className='form-control'
          id='exampleInputName2'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label className='bmd-label-floating' htmlFor='exampleInputEmail1'>
          Email
        </label>
        <input
          onChange={this.handleChange('email')}
          type='email'
          className='form-control'
          id='exampleInputEmail1'
          value={email}
        />
        <span className='bmd-help'>
          We'll never share your email with anyone else.
        </span>
      </div>

      <div className='form-group'>
        <label className='bmd-label-floating' htmlFor='exampleInputPassword1'>
          Password
        </label>
        <input
          onChange={this.handleChange('password')}
          type='password'
          className='form-control'
          id='exampleInputPassword1'
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className='btn btn-raised btn-warning'>
        SignUp
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, open } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>SignUp</h2>

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

        <div
          className='alert alert-primary'
          style={{ display: open ? '' : 'none' }}
        >
          Signup successful!{' '}
          <span role='img' aria-label='face'>
            😄
          </span>{' '}
          Please <Link to='/signin'>SignIn</Link>
          <button
            type='button'
            className='close'
            data-dismiss='alert'
            aria-label='Close'
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>

        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
