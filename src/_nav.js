import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilApplications,
  cilLibraryAdd,
  cilPlaylistAdd,
  cilFork,
  cilUserPlus,
  cilUser,
  cilCart,
  cilChart,
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
      {
        component: CNavItem,
        name: 'Add status',
        to: '/addstatus',
        icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Users management',
  },
  {
    component: CNavItem,
    name: 'All users',
    to: '/allusers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add user',
    to: '/adduser',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add role',
    to: '/addrole',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Orders management',
  },
  {
    component: CNavItem,
    name: 'All orders',
    to: '/allorders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Revenue management',
  },
  {
    component: CNavItem,
    name: 'Revenue',
    to: '/revenue',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
]

export default _nav
