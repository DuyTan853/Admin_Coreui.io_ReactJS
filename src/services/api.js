import axios from 'axios'

const api_all_products = import.meta.env.VITE_API_SHOW_PRODUCTS
const api_all_brands = import.meta.env.VITE_API_SHOW_BRANDS
const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
const api_all_specs = import.meta.env.VITE_API_SHOW_SPECS
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
