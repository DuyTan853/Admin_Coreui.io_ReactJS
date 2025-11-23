import { useEffect, useState } from 'react'
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
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilPencil, cilCloudUpload } from '@coreui/icons'
import { allSpecsApi } from '../../services/api'

// define api link
const api_add_spec = import.meta.env.VITE_API_ADD_SPEC
const api_update_spec = import.meta.env.VITE_API_UPDATE_SPEC

function FormAddSpec() {
  const [allSpecs, setAllSpecs] = useState(['']) // chứa data từ api brand
  const [containerSpecs, setContainerSpecs] = useState({ id: '' })
  const [keySpec, setKeySpec] = useState('Selection Spec')

  // gọi api và thực hiện show brand
  const CBFetchAllSpecs = async () => {
    //nếu tách fetchAllBrand khỏi useEffect thì bị báo lỗi eslint nên tạo hẳn hàm mới cho việc gọi lại api khi CRUD brand mới
    try {
      const result = await allSpecsApi()
      setAllSpecs(result.specs)
    } catch (error) {
      console.log('call api error:', error)
    }
  }

  //callapi first one
  useEffect(() => {
    const fetchAllSpecs = async () => {
      try {
        const result = await allSpecsApi()
        setAllSpecs(result.specs)
      } catch (error) {
        console.log('call api error:', error)
      }
    }
    fetchAllSpecs()
  }, [])

  // show key specs
  const specKeys = Object.keys(allSpecs[0])
    .filter((key) => key !== 'id')
    .map((key) => ({
      label: formatLabel(key),
      value: key,
    }))

  // sửa chuỗi , tách khoảng với trước chữ in hoa và in hoa chữ đầu
  function formatLabel(text) {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // không tách giữa chữ viết tắt
      .replace(/^./, (char) => char.toUpperCase())
  }
  const handleChangeFormInput = (e) => {
    const { value } = e.target
    setContainerSpecs((prev) => ({ ...prev, [keySpec]: value }))
    console.log(containerSpecs)
  }

  // selection spec by key
  const selectionSpecByKey = (e) => {
    const { value } = e.target
    setKeySpec(value)
  }

  // button pushlish, nếu id thay đổi thì if else button sẽ linh động add và update
  const clickAddOrUpdateSpec = () => {
    if (!containerSpecs.id) {
      addSpec()
    } else {
      updateSpec(containerSpecs.id)
    }
  }

  // add spec
  const addSpec = async () => {
    const formData = new FormData()
    for (let key in containerSpecs) {
      formData.append(key, containerSpecs[key])
    }
    try {
      await axios.post(`${api_add_spec}`, formData)
      alert('thêm spec thành công!')
    } catch (error) {
      console.error('Lỗi khi thêm spec:', error)
      alert('add spec thất bại!')
    }
    CBFetchAllSpecs()
    setContainerSpecs({ id: '', [keySpec]: '' })
  }

  // update spec
  const clickShowEditCategoryById = (specs) => {
    setContainerSpecs({ id: specs.id, [keySpec]: specs[keySpec] })
    console.log(containerSpecs.id)
  }

  const updateSpec = async (id) => {
    const formData = new FormData()
    for (let key in containerSpecs) {
      formData.append(key, containerSpecs[key])
    }
    try {
      await axios.patch(`${api_update_spec}${id}`, formData)
      alert('update spec thành công!')
    } catch (error) {
      console.error('Lỗi khi update spec:', error)
      alert('update spec thất bại!')
    }
    CBFetchAllSpecs()
    setContainerSpecs({ id: '', [keySpec]: '' })
  }

  // delete spec
  const clickDeleteProductById = async (id) => {
    try {
      await axios.patch(
        `${api_update_spec}${id}`,
        { [keySpec]: null }, // không dùng formData(tự chuyển vể string) thì giá trị nhận vào là đúng null
        { headers: { 'Content-Type': 'application/json' } },
      )
      alert('delete spec thành công!')
    } catch (error) {
      console.error('Lỗi khi delete spec:', error)
      alert('delete spec thất bại!')
    }
    CBFetchAllSpecs()
    setContainerSpecs({ id: '', [keySpec]: '' })
  }

  // button cancel
  const clickUpdateBrand = () => {
    setContainerSpecs({ id: '', [keySpec]: '' })
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
              onClick={() => clickAddOrUpdateSpec()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {containerSpecs.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={() => clickUpdateBrand()}
              >
                CANCEL <CIcon icon={cilPencil} size="lg" />
              </CButton>
            )}
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={5}>
                <CRow>
                  <CCol sm={12}>
                    <CFormSelect
                      className="mb-3"
                      aria-label="Default select example"
                      value={keySpec || ''}
                      options={[
                        { label: '--- Selection Spec ---', value: '' },
                        ...specKeys, // thêm từ API
                      ]}
                      onChange={(e) => selectionSpecByKey(e)} // lưu value
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Input specs"
                      name="nameBrand"
                      value={containerSpecs[keySpec] || ''}
                      onChange={handleChangeFormInput}
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={7}>
                <CCardBody>
                  <CTable bordered striped hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">{formatLabel(keySpec)}</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {keySpec !== 'Selection Spec' ? (
                        allSpecs
                          .filter(
                            (specs) => specs[keySpec] !== null && specs[keySpec] !== undefined,
                          )
                          .map((specs, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{specs[keySpec]}</CTableDataCell>
                              <CTableDataCell>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                  <CButton
                                    color="primary"
                                    onClick={() => clickShowEditCategoryById(specs)}
                                  >
                                    <CIcon icon={cilPencil} />
                                  </CButton>
                                  <CButton
                                    color="danger"
                                    onClick={() => clickDeleteProductById(specs.id)}
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

export default FormAddSpec
