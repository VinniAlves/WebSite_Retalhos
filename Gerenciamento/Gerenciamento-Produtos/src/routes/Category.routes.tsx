import type { JSX } from 'react'
import CategoryPage from '../pages/categories/CategoryPage'

const PATHCategory: { path: string; element: JSX.Element }[] = [
  { path: 'categorias', element: <CategoryPage /> },
]

export default PATHCategory
