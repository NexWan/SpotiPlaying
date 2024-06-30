"use server";

import React from 'react'
import { cookies } from 'next/headers'

export const page = () => {
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value?.toString()
  const authToken = cookieStore.get("authToken")?.value?.toString()
  console.log(userId + " " + authToken)
  return (
    <div>
      <h1>Welcome to the home page</h1>
      <p>User ID: {userId}</p>
      <p>Auth Token: {authToken}</p>
    </div>
  )
}

export default page