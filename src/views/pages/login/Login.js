import axios from 'axios'
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
import { callApi } from '../../../services/api.js'

const api_login = import.meta.env.VITE_API_LOGIN

const Login = () => {
  const navigate = useNavigate()

  const [apiUser, setApiUser] = useState([])
  const [account, setAccount] = useState({ userName: '', password: '' })

  // handle input account
  const handleInput = (e) => {
    const { name, value } = e.target
    setAccount((prev) => ({ ...prev, [name]: value }))
    console.log(account)
  }

  // click handle login
  const handleLogin = async () => {
    if (!account.userName || !account.password) {
      alert('Vui lòng nhập đủ thông tin')
      return
    }
    try {
      const res = await axios.post(`${api_login}`, {
        userName: account.userName,
        password: account.password,
      })
      const { token, user } = res.data

      const loginData = {
        token,
        user,
        loginDate: new Date().toISOString(),
      }

      localStorage.setItem('auth', JSON.stringify(loginData))
      navigate('/dashboard', { replace: true })
      window.location.reload()
    } catch (error) {
      alert('Tài khoản hoặc mật khẩu không đúng')
      // setAccount({ userName: '', password: '' })
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
