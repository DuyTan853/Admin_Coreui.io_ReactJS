import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  CCol,
  CFormInput,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilFile, cilPencil } from '@coreui/icons'
import { allProductsApi } from '../../services/api'
import FormUpdareProduct from './FormUpdateProduct.js'

const api_delete_products = import.meta.env.VITE_API_DELETE_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const Product = () => {
  const [allProducts, setAllProducts] = useState([]) // State to hold all products data
  const [update, setUpdate] = useState(false)

  const fetchResetApi = async () => {
    try {
      const result = await allProductsApi() // productApi trả về response.data
      setAllProducts(result.products) // API trả về một đối tượng với mảng 'products'
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    // Gọi Api khi component mount
    const fetchAllData = async () => {
      try {
        const result = await allProductsApi() // productApi trả về response.data
        setAllProducts(result.products) // API trả về một đối tượng với mảng 'products'
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchAllData()
  }, [])

  const formatVND = (amount) => {
    amount = Number(amount)
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  // show detail product
  const clickShowDetailProduct = (id) => {
    console.log(id)
  }

  // edit product
  const clickEditProductById = (product) => {
    console.log(product.categoryId)
    setUpdate({ product: { ...product }, update: true })
  }

  // delete product
  const clickDeleteProductById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      await axios.delete(`${api_delete_products}${id}`)
      setAllProducts((prev) => prev.filter((p) => p.id !== id))
      alert('Xóa sản phẩm thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err)
      alert('Xóa sản phẩm thất bại!')
    }
    fetchResetApi()
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3}>
            <CFormInput type="text" size="sm" placeholder="search" aria-label="sm input example" />
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CTable bordered striped hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col">Price orginal</CTableHeaderCell>
                <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allProducts.length > 0 ? (
                allProducts.map((product, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">
                      <img
                        src={`${host_name}${product.thumbnail}`}
                        alt={product.nameProduct}
                        className="product-image"
                      />
                      {product.nameProduct}
                    </CTableHeaderCell>
                    <CTableDataCell>{product?.category?.nameCategory}</CTableDataCell>
                    <CTableDataCell>{product?.brand?.nameBrand}</CTableDataCell>
                    <CTableDataCell>{product?.specs?.quantity}</CTableDataCell>
                    <CTableDataCell>{formatVND(product.originalPrice)}</CTableDataCell>
                    <CTableDataCell>{formatVND(product.price)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton
                          color="info"
                          onClick={() => clickShowDetailProduct(product.idProduct)}
                        >
                          <CIcon icon={cilFile} />
                        </CButton>
                        <CButton color="primary" onClick={() => clickEditProductById(product)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => clickDeleteProductById(product.idProduct)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <></>
              )}
            </CTableBody>
          </CTable>
          <CPagination align="center" aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous" disabled>
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            <CPaginationItem active>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>
      {/* truyền prop cho FormUpdareProduct giá trị onClose và setUpdate(flase) để bên FormUpdareProduct viết sự kiện onClick để thực thi Cancel */}
      {update && (
        <FormUpdareProduct
          visible={update.update}
          product={update.product}
          Cancel={() => setUpdate(false)}
          fetchResetApi={fetchResetApi}
        />
      )}
    </>
  )
}

export default Product
