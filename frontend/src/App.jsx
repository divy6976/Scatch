import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import Approutes from './routes/Approutes'

import './App.css'

function App() {
  

  return (
    <>
      <RouterProvider router={Approutes} />
    </>
  )
}

export default App
