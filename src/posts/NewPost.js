import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { create } from './apiPost';
import { isAuthenticated } from '../auth';
import '../App.css';

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      body: '',
      photo: '',
      error: '',
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 300000) {
      this.setState({
        error: 'File size should be less than 300kb',
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: 'All fields are required', loading: false });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: '',
            body: '',
            photo: '',
            redirectToProfile: true
          });
        }
      });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Post Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='bmd-label-floating' htmlFor='title'>
          Title
        </label>
        <input
          onChange={this.handleChange('title')}
          type='text'
          className='form-control'
          id='id'
          value={title}
        />
      </div>

      <div className='form-group'>
        <label className='bmd-label-floating' htmlFor='body'>
          Body
        </label>
        <textarea
          onChange={this.handleChange('body')}
          type='text'
          className='form-control'
          id='body'
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Create Post
      </button>
    </form>
  );
  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create New Post</h2>
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

        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
