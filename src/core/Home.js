import React from 'react';
import Posts from '../posts/Posts';

const Home = () => (
  <div>
    <div className='jumbotron'>
      <h2>Home</h2>
      <p className='lead'>Welcome to friendsSocial</p>
    </div>

    <div className='container'>
      <Posts />
    </div>
  </div>
);

export default Home;
