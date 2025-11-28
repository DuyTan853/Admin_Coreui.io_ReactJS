import axios from 'axios'
////////// Tối ưu sau
const api_all_products = import.meta.env.VITE_API_SHOW_PRODUCTS
const api_show_products_by_limit = import.meta.env.VITE_API_SHOW_PRODUCTS_LIMIT
const api_all_brands = import.meta.env.VITE_API_SHOW_BRANDS
const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
const api_all_specs = import.meta.env.VITE_API_SHOW_SPECS
const api_all_status = import.meta.env.VITE_API_SHOW_STATUS
const api_all_users = import.meta.env.VITE_API_SHOW_USERS
const api_all_role = import.meta.env.VITE_API_SHOW_ROLE
const api_show_users_by_limit = import.meta.env.VITE_API_SHOW_USERS_LIMIT

export const allProductsApi = () =>
  axios
    .get(api_all_products)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allBrandsApi = () =>
  axios
    .get(api_all_brands)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allCategoriesApi = () =>
  axios
    .get(api_all_categories)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allSpecsApi = () =>
  axios
    .get(api_all_specs)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const showProductByLimit = (page, limit) =>
  axios
    .get(`${api_show_products_by_limit}?page=${page}&limit=${limit}`)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allStatusApi = () =>
  axios
    .get(api_all_status)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allUserApi = () =>
  axios
    .get(api_all_users)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const allRoleApi = () =>
  axios
    .get(api_all_role)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const showUsersByLimit = (page, limit) =>
  axios
    .get(`${api_show_users_by_limit}?page=${page}&limit=${limit}`)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })
