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
import { showUsersByLimit } from '../../services/api.js'
import FormUpdareUser from '../users/FormUpdateUser.js'

const api_delete_user = import.meta.env.VITE_API_DELETE_USER
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const Users = () => {
  const [allUsers, setAllUsers] = useState([]) // State to hold all products data
  const [update, setUpdate] = useState(false)
  const [page, setPage] = useState(1) // trang hiện tại
  const [limit] = useState(10) // số user mỗi trang
  const [totalPages, setTotalPages] = useState(1)

  const fetchResetApi = async () => {
    const result = await showUsersByLimit(page, limit) //res.data để nhận dữ liệu từ be gửi lên
    setAllUsers(result.users) // mảng user be gửi lên
    setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await showUsersByLimit(page, limit) //res.data để nhận dữ liệu từ be gửi lên
      setAllUsers(result.users) // mảng user be gửi lên
      setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
    }
    fetchApi(page, limit)
  }, [page, limit])
  console.log(allUsers)
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
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return

    try {
      await axios.delete(`${api_delete_user}${id}`)
      setAllUsers((prev) => prev.filter((p) => p.idUser !== id))
      alert('Xóa user thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa user:', err)
      alert('Xóa user thất bại!')
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
                <CTableHeaderCell scope="col">User</CTableHeaderCell>
                <CTableHeaderCell scope="col">Full name</CTableHeaderCell>
                <CTableHeaderCell scope="col">User name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allUsers.length > 0 ? (
                allUsers.map((user, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">
                      <img
                        src={`${host_name}${user.avatar}`}
                        alt={user.fullName}
                        className="user-image"
                      />
                      {}
                    </CTableHeaderCell>
                    <CTableDataCell>{user.fullName}</CTableDataCell>
                    <CTableDataCell>{user.userName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>{user.addresses}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                        <CButton color="info" onClick={() => clickShowDetailProduct(user.idUser)}>
                          <CIcon icon={cilFile} />
                        </CButton>
                        <CButton color="primary" onClick={() => clickEditProductById(user)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" onClick={() => clickDeleteProductById(user.idUser)}>
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
      {/* truyền prop cho FormUpdareUser giá trị onClose và setUpdate(flase) để bên FormUpdareUser viết sự kiện onClick để thực thi Cancel */}
      {update && (
        <FormUpdareUser
          visible={update.update}
          product={update.product}
          Cancel={() => setUpdate(false)}
          fetchResetApi={fetchResetApi}
        />
      )}
    </>
  )
}

export default Users
