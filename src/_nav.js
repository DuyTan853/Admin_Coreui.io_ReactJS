import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilApplications,
  cilLibraryAdd,
  cilPlaylistAdd,
  cilFork,
} from '@coreui/icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'Product management',
  },
  {
    component: CNavItem,
    name: 'All products',
    to: '/allproducts',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add products',
    to: '/addproducts',
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Add attributes',
    icon: <CIcon icon={cilFork} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add brand',
        to: '/addbrands',
        icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add categories',
        to: '/addcategories',
        icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add specs',
        to: '/addspes',
        icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Customers management',
  },
]

export default _nav
