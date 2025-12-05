import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalBody,
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCloudUpload, cilPencil } from '@coreui/icons'
import imageUpLoadEmpty from '/public/image.png'
import { callApi } from '../../services/api.js'

const api_all_role = import.meta.env.VITE_API_SHOW_ROLE
const api_update_user = import.meta.env.VITE_API_UPDATE_USER
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const FormUpdateUser = ({ visible, user, Cancel, fetchResetApi }) => {
  const navigate = useNavigate() // hook của react-router-dom , dùng để chuyển page

  const inputFileRef = useRef(null)

  const [containerUser, setContainerUser] = useState({
    id: user.id,
    idUser: user.idUser,
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
    password: user.password,
    phone: user.phone,
    role: user.role,
    permissions: user.permissions,
    avatar: user.avatar,
    addresses: user.addresses,
    isVerified: user.isVerified,
  })

  const [previewAvatar, setPreviewAvatar] = useState(
    user.avatar ? [{ preview: `${host_name}${user.avatar}` }] : [],
  ) // show image trực tiếp sau khi chọn file
  const [avatarFile, setAvatarFile] = useState([])
  const [apiRole, setApiRole] = useState([])

  useEffect(() => {
    const fetchRoleApi = async () => {
      try {
        const result = await callApi(api_all_role)
        setApiRole(result.role)
      } catch (error) {
        console.log('fetchApi error:', error)
      }
    }
    fetchRoleApi()
  }, [])

  const valueRole = apiRole.map((value) => ({
    label: value.roleName,
    value: value.roleName,
  }))

  const valuePermissions = apiRole.map((value) => ({
    label: value.permissions,
    value: value.permissions,
  }))

  // Khi người dùng chọn file thumnail
  const handleFileAvatar = (e) => {
    const files = Array.from(e.target.files)
    const previewAvatar = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewAvatar(previewAvatar)
    setAvatarFile(files)
  }

  // event follow form input
  const handleInputForm = (e) => {
    const { name, value, type, checked } = e.target

    setContainerUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectionFormRole = () => {}

  // button add publish send request to server
  const clickAddUser = async () => {
    const formData = new FormData()

    formData.append('avatarFile', avatarFile[0])
    formData.append('FinalUser', JSON.stringify(containerUser))
    try {
      await axios.patch(`${api_update_user}${user.idUser}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('cập nhập user thành công!')
      fetchResetApi()
      Cancel(true)
      navigate('/allusers')
    } catch (err) {
      alert('cập nhập user Không thành công!')
      console.error('Lỗi khi cập nhập user:', err)
    }
  }

  return (
    <>
      <CModal
        size="xl"
        visible={visible}
        backdrop="static"
        aria-labelledby="ScrollingLongContentExampleLabel"
      >
        <CModalBody>
          <CCard className="mb-4">
            <CCardHeader>
              <CCol sm={3} className="d-flex gap-4">
                <CButton
                  color="primary"
                  type="submit"
                  className="fw-bold mb-2 mt-2"
                  onClick={() => clickAddUser()}
                >
                  PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
                </CButton>
                <CButton
                  color="primary"
                  type="submit"
                  className="fw-bold mb-2 mt-2"
                  onClick={Cancel}
                >
                  CANCEL <CIcon icon={cilPencil} size="lg" />
                </CButton>
              </CCol>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow>
                  <CCol sm={3}>
                    {/* Ẩn input file */}
                    <CFormInput
                      className="mb-3 avatar-add"
                      type="file"
                      multiple
                      name="avatar"
                      onChange={handleFileAvatar}
                      ref={inputFileRef}
                      style={{ display: 'none' }}
                    />

                    {/* Hiển thị ảnh xem trước */}
                    {previewAvatar.length > 0 ? (
                      previewAvatar.map((img, index) => (
                        <img
                          className="mb-3 avatar-add"
                          key={index}
                          src={img.preview}
                          alt={`preview-${index}`}
                          onClick={() => inputFileRef.current.click()} // click vào ảnh mở file picker
                        />
                      ))
                    ) : (
                      <img
                        className="mb-3 avatar-add"
                        src={imageUpLoadEmpty}
                        alt="upload image"
                        onClick={() => inputFileRef.current.click()} // click vào ảnh mở file picker
                      />
                    )}
                  </CCol>
                  <CCol sm={9}>
                    <CRow>
                      <CCol sm={6}>
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="Full name"
                          name="fullName"
                          value={containerUser.fullName}
                          onChange={handleInputForm}
                        />
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="User name"
                          name="userName"
                          value={containerUser.userName}
                          onChange={handleInputForm}
                        />
                      </CCol>
                      <CCol sm={6}>
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="Email"
                          name="email"
                          value={containerUser.email}
                          onChange={handleInputForm}
                        />
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="Phone number"
                          name="phone"
                          value={containerUser.phone}
                          onChange={handleInputForm}
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol sm={6}>
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="Password"
                          name="password"
                          value={containerUser.password}
                          onChange={handleInputForm}
                        />
                        {/* <CFormInput
                                className="mb-3"
                                type="text"
                                label="Confirm password"
                                name="confirm password"
                                value={containerUser.password}
                                onChange={handleInputForm}
                              /> */}
                      </CCol>
                      <CCol sm={6}>
                        <CFormInput
                          className="mb-3"
                          type="text"
                          label="Address"
                          name="addresses"
                          value={containerUser.addresses}
                          onChange={handleInputForm}
                        />
                        <CFormSelect
                          className="mb-3"
                          label="Role"
                          name="role"
                          options={[
                            { label: containerUser.role || '- - - Select role - - -', value: '' },
                            ...valueRole,
                          ]}
                          onChange={(e) => handleSelectionFormRole(e)}
                        />
                        <CFormSelect
                          className="mb-3"
                          label="Permissions"
                          name="permissions"
                          options={[
                            {
                              label: containerUser.permissions || '- - - Select permissions - - -',
                              value: '',
                            },
                            ...valuePermissions,
                          ]}
                          onChange={(e) => handleSelectionFormRole(e)}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>
    </>
  )
}
export default FormUpdateUser
