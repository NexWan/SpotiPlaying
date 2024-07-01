'use client';

import React from 'react'
import View from './view';
import { useState } from 'react';

const Home = () => {
  var [authToken, setAuthToken] = useState('');
  var [userId, setUserId] = useState('');

  fetch('http://localhost:3000/api/getToken',{
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }).then((data) => {
    console.log(data);
    setAuthToken(data.auth);
    setUserId(data.user);
  })
  console.log(userId + " " + authToken)
  return (
    <div className="h-fit w-screen bg-white">
      <header className='bg-gray-800 text-white text-center p-4 flex justify-center items-center mx-auto'>
        <div className='w-1/3'>
        <h1>Developed by: <a href='https://github.com/NexWan' className=' underline underline-offset-2'>NexWan</a></h1>
        </div>
        <div className='w-1/3'>
          <h1 className='text-2xl'>SpotiPlaying</h1>
        </div>
        <div className='w-1/3'>
        </div>
      </header>
      <div className=' max-w-4xl flex flex-col mx-auto justify-center items-center bg-white p-12'>
        <h1>Welcome to the home page</h1>
        <p>Here you can see the preview of your spotify card!</p>
        <>
          <View />
        </>
        <p>You can access the link of the embed through this link:</p>
        <a href={`http://localhost:3000/view?userId=${userId}`} className='underline underline-offset-2'>http://localhost:3000/view?userId={userId}</a>
      </div>
    </div>
  );
};

export default Home;