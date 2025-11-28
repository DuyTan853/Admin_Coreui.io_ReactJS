import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//duytan
const Product = React.lazy(() => import('./views/product/Product.js'))
const FormAddProduct = React.lazy(() => import('./views/product/FormAddProduct.js'))
const FormAddBrand = React.lazy(() => import('./views/product/FormAddBrand.js'))
const FormAddCategory = React.lazy(() => import('./views/product/FormAddCaterory.js'))
const FormAddSpec = React.lazy(() => import('./views/product/FormAddSpec.js'))
const FormAddStatus = React.lazy(() => import('./views/product/FormAddStatus.js'))
const User = React.lazy(() => import('./views/users/Users.js'))
const FormAddUser = React.lazy(() => import('./views/users/FormAddUser.js'))
const FormAddRole = React.lazy(() => import('./views/users/FormAddRole.js'))
const Revenue = React.lazy(() => import('./views/revenue/Revenue.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  //duytan
  { path: '/allproducts', name: 'All products', element: Product },
  { path: '/addproducts', name: 'Add products', element: FormAddProduct },
  { path: '/addbrands', name: 'Add brands', element: FormAddBrand },
  { path: '/addcategories', name: 'Add categories', element: FormAddCategory },
  { path: '/addspes', name: 'Add specs', element: FormAddSpec },
  { path: '/addstatus', name: 'Add specs', element: FormAddStatus },
  { path: '/allusers', name: 'Add specs', element: User },
  { path: '/adduser', name: 'Add specs', element: FormAddUser },
  { path: '/addrole', name: 'Add specs', element: FormAddRole },
  { path: '/revenue', name: 'Add specs', element: Revenue },
]

export default routes
