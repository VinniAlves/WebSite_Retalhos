import './App.css'
import useRoutes from './routes'
import {  Route, Routes } from 'react-router-dom'



function App() {

const routes = useRoutes();

  return (
      <Routes>
          {       
            routes.map((route,index)=>(          
                <Route key={index} path={route.path} element={route.element}>  
                </Route>
            )) 
          }
      </Routes>
  )
}

export default App
