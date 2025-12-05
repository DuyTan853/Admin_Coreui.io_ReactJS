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
import { callApiByLimit } from '../../services/api'
import FormUpdareProduct from './FormUpdateProduct.js'

const api_show_products_by_limit = import.meta.env.VITE_API_SHOW_PRODUCTS_LIMIT
const api_delete_products = import.meta.env.VITE_API_DELETE_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const Product = () => {
  const [allProducts, setAllProducts] = useState([]) // State to hold all products data
  const [update, setUpdate] = useState(false)
  const [page, setPage] = useState(1) // trang hiện tại
  const [limit] = useState(10) // số sản phẩm mỗi trang
  const [totalPages, setTotalPages] = useState(1)

  const fetchResetApi = async () => {
    const result = await callApiByLimit(api_show_products_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
    setAllProducts(result.products) // mảng sản phẩm be gửi lên
    setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await callApiByLimit(api_show_products_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
      setAllProducts(result.products) // mảng sản phẩm be gửi lên
      setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
    }
    fetchApi(page, limit)
  }, [page, limit])

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
          {/* ---------------------PHÂN TRANG---------------------- */}
          <CPagination align="center">
            <CPaginationItem
              aria-label="Previous"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </CPaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              aria-label="Next"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
          {/* ------------------------------------------- */}
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
