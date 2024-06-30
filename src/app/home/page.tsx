
'use client';

import React from 'react'
import View from './view';
import { useState } from 'react';

export const Page = () => {
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
    <div>
      <h1>Welcome to the home page</h1>
      <p>User ID: {userId}</p>
      <p>Auth Token: {authToken}</p>
      <>
        <View />
      </>
    </div>
  )
}

export default Page