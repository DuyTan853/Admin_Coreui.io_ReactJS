import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilPencil, cilCloudUpload } from '@coreui/icons'
import { allStatusApi } from '../../services/api'

// define api link
const api_add_status = import.meta.env.VITE_API_ADD_STATUS
const api_update_status = import.meta.env.VITE_API_UPDATE_STATUS
const api_delete_status = import.meta.env.VITE_API_DELETE_STATUS

function FormAddStatus() {
  const [allStatus, setAllStatus] = useState([]) // chứa data từ api brand
  const [containerStatus, setContainerStatus] = useState({ id: '', statusName: '' })

  const CBFetchAllStatus = async () => {
    //nếu tách fetchAllStatus khỏi useEffect thì bị báo lỗi eslint nên tạo hẳn hàm mới cho việc gọi lại api khi CRUD status mới
    try {
      const result = await allStatusApi()
      setAllStatus(result.status)
    } catch (error) {
      console.log('call api error:', error)
    }
  }
  useEffect(() => {
    const fetchAllStatus = async () => {
      try {
        const result = await allStatusApi()
        setAllStatus(result.status)
      } catch (error) {
        console.log('call api error:', error)
      }
    }
    fetchAllStatus()
  }, [])

  // event follow form input
  const handleChange = (e) => {
    const { name, value } = e.target
    setContainerStatus((prev) => ({ ...prev, [name]: value || '' }))
  }

  const clickAddOrUpdateStatus = () => {
    if (containerStatus.id === '') {
      addStatus()
    } else {
      updateStatus(containerStatus.id)
    }
  }

  // button add publish send request to server
  const addStatus = async () => {
    const formData = new FormData()

    formData.append('statusName', containerStatus.statusName)

    try {
      const res = await axios.post(`${api_add_status}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('thêm brand thành công!')
      console.log(res.data)
    } catch (err) {
      console.error('Lỗi khi tạo brand:', err)
    }

    CBFetchAllStatus()
    setContainerStatus({ id: '', statusName: '' })
  }

  // edit brand
  const clickShowEditStatusById = async (id, statusName) => {
    setContainerStatus({ id, statusName })
  }

  const updateStatus = async (id) => {
    const formData = new FormData()
    formData.append('statusName', containerStatus.statusName)
    try {
      await axios.put(`${api_update_status}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Sửa status thành công!')
      CBFetchAllStatus() // reload list
    } catch (err) {
      console.error('Lỗi khi sửa brand:', err)
      alert('Sửa brand thất bại!')
    }
    // reload list và reset form
    CBFetchAllStatus()
    setContainerStatus({ id: '', statusName: '' })
  }

  // button cancel update
  const clickUpdateStatus = () => {
    setContainerStatus({ id: '', statusName: '' })
  }

  // delete brand
  const clickDeleteStausById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa status này?')) return

    try {
      await axios.delete(`${api_delete_status}${id}`)
      alert('Xóa status thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa status:', err)
      alert('Xóa status thất bại!')
    }
    // reload list và reset form
    CBFetchAllStatus()
    setContainerStatus({ id: '', statusName: '' })
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3} className="d-flex gap-4">
            <CButton
              color="primary"
              type="submit"
              className="fw-bold mb-2 mt-2"
              onClick={() => clickAddOrUpdateStatus()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {containerStatus.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={() => clickUpdateStatus()}
              >
                CANCEL <CIcon icon={cilPencil} size="lg" />
              </CButton>
            )}
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={4}>
                <CRow>
                  <CCol sm={12}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Status name"
                      name="statusName"
                      value={containerStatus.statusName}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={8}>
                <CCardBody>
                  <CTable bordered striped hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Staus name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {allStatus.length > 0 ? (
                        allStatus.map((status, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{status.statusName}</CTableDataCell>
                            <CTableDataCell>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <CButton
                                  color="primary"
                                  onClick={() =>
                                    clickShowEditStatusById(status.id, status.statusName)
                                  }
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  onClick={() => clickDeleteStausById(status.id)}
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
                </CCardBody>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormAddStatus
