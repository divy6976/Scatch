import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/general/Home'
import FoodAdd from '../food-partner/FoodAdd'
import Profile from '../food-partner/Profile'
import Saved from '../pages/general/Saved'

const Approutes = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/user/login',
    element: <UserLogin />
  },
  {
    path: '/user/register',
    element: <UserRegister />
  },
  {
    path: '/foodpartner/login',
    element: <FoodPartnerLogin />
  },
  {
    path: '/foodpartner/register',
    element: <FoodPartnerRegister />
  },
  {
    path: '/food/feed',
    element: <h1>Food Feed</h1>
  },
  {
    path: '/food/add',
    element: <FoodAdd />
  },
  {
    path: '/food/edit/:id',
    element: <h1>Edit Food</h1>
  },
  {
    path: '/food/delete/:id',
    element: <h1>Delete Food</h1>
  },
  {
    path: '/store/:id',
    element: <Profile />
  },
  {
    path: '/saved',
    element: <Saved />
  }
])

export default Approutes




