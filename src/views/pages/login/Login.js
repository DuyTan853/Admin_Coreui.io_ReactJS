import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { allUserApi } from '../../../services/api.js'

const Login = () => {
  const navigate = useNavigate()

  const [apiUser, setApiUser] = useState([])
  const [account, setAccount] = useState({ userName: '', password: '' })

  useEffect(() => {
    const fetchApiUser = async () => {
      const result = await allUserApi()
      setApiUser(result.users)
    }
    fetchApiUser()
  }, [])

  // handle input account
  const handleInput = (e) => {
    const { name, value } = e.target
    setAccount((prev) => ({ ...prev, [name]: value }))
    console.log(account)
  }

  // click handle login
  const handleLogin = async () => {
    const foundUser = apiUser.find(
      (user) => user.userName === account.userName && user.password === account.password,
    )

    if (!account.userName || !account.password) {
      alert('Vui lòng nhập đủ thông tin')
      return
    }

    if (foundUser) {
      // lưu đăng nhập vào localStorage để có thể sử dụng ở các page khác với dữ liệu của user này
      const loginData = {
        user: foundUser,
        loginDate: new Date().toISOString(),
      }
      localStorage.setItem('auth', JSON.stringify(loginData))

      navigate('/dashboard', { replace: true })
      window.location.reload() // ép reload để đọc localStorage mới
    } else {
      alert('tài khoản không đúng vui lòng nhập lại ')
      setAccount({ userName: '', password: '' })
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      name="userName"
                      value={account.userName}
                      onChange={handleInput}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={account.password}
                      name="password"
                      onChange={handleInput}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" className="px-4" onClick={handleLogin}>
                        Login
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" className="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
