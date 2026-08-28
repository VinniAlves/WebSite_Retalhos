import './App.css'
import useRoutes from './routes'
import { Route, Routes } from 'react-router-dom'
import GoogleAnalytics from './components/GoogleAnalytics'

function App() {

  const routes = useRoutes();

  return (
    <>
      <GoogleAnalytics />
      <Routes>
        {
          routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
            </Route>
          ))
        }
      </Routes>
    </>
  )
}

export default App

