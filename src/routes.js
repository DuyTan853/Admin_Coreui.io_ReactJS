import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//duytan
const Product = React.lazy(() => import('./views/product/Product.js'))
const FormAddProduct = React.lazy(() => import('./views/product/FormAddProduct.js'))
const FormAddBrand = React.lazy(() => import('./views/product/FormAddBrand.js'))
const FormAddCategory = React.lazy(() => import('./views/product/FormAddCaterory.js'))
const FormAddSpec = React.lazy(() => import('./views/product/FormAddSpec.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  //duytan
  { path: '/allproducts', name: 'All products', element: Product },
  { path: '/addproducts', name: 'Add products', element: FormAddProduct },
  { path: '/addbrands', name: 'Add brands', element: FormAddBrand },
  { path: '/addcategories', name: 'Add categories', element: FormAddCategory },
  { path: '/addspes', name: 'Add specs', element: FormAddSpec },
]

export default routes
