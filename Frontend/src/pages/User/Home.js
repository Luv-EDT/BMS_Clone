import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)


  useEffect(()=>{
  if(user.isAdmin){
    navigate("/admin")
  }
  else if(user.isProfile){
    navigate("/profile")
  }
  }, [])


  return (
    <div>
      <Navbar />
      <div>....</div>
    </div>
  )
}

export default Home