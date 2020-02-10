import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
      loading: false
    };
  }

  handleChange = name => event => {
    this.setState({ error: '' });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  signinForm = (email, password) => (
    <form>
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
        SignIn
      </button>
    </form>
  );

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to='/' />;
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>SignIn</h2>

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
            <h2>Loading....</h2>
          </div>
        ) : (
          ''
        )}

        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;
