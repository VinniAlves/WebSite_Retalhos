import type { JSX } from 'react'
import ProductListPage from '../pages/products/ProductListPage'
import ProductWizardPage from '../pages/products/ProductWizardPage'
import ProductEditPage from '../pages/products/ProductEditPage'

const PATHProduct: { path: string; element: JSX.Element }[] = [
  { path: 'produtos', element: <ProductListPage /> },
  { path: 'produtos/novo', element: <ProductWizardPage /> },
  { path: 'produtos/:id/editar', element: <ProductEditPage /> },
]

export default PATHProduct
