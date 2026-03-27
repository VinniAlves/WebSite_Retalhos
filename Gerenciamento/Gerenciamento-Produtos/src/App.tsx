import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import useRoutes from './routes'
import './App.css'

function App() {
  const childRoutes = useRoutes()

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/produtos" replace />} />
        {childRoutes.map((route, index) => (
          <Route key={`${route.path}-${index}`} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
