import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCardImage,
  CCardLink,
  CListGroup,
  CListGroupItem,
  CFormTextarea,
  CButton,
  CCallout,
} from '@coreui/react'
import { callApi } from '../../services/api.js'
import { useEffect, useState } from 'react'

const show_api_question = import.meta.env.VITE_API_SHOW_QUESTION
const api_show_products = import.meta.env.VITE_API_SHOW_PRODUCTS
const api_show_users = import.meta.env.VITE_API_SHOW_USERS
const api_answer = import.meta.env.VITE_API_ANSWER_QUESTION

const ProductQuestion = () => {
  const [apiQuestion, setApiQuestion] = useState([])
  const [apiProducts, serApiProducts] = useState([])
  const [apiUsers, serApiUsers] = useState([])
  const [answer, setAnswer] = useState({})

  const fetchResetApi = async () => {
    // api question
    const resultQuestions = await callApi(show_api_question)
    setApiQuestion(resultQuestions)

    //api products
    const resultProducts = await callApi(api_show_products)
    serApiProducts(resultProducts.products)

    // api users
    const resultUsers = await callApi(api_show_users)
    serApiUsers(resultUsers.users)
  }
  useEffect(() => {
    const fetchApi = async () => {
      // api question
      const resultQuestions = await callApi(show_api_question)
      setApiQuestion(resultQuestions)

      //api products
      const resultProducts = await callApi(api_show_products)
      serApiProducts(resultProducts.products)

      // api users
      const resultUsers = await callApi(api_show_users)
      serApiUsers(resultUsers.users)
    }
    fetchApi()
  }, [])

  const handleAnswer = (e) => {
    const { name, value } = e.target
    setAnswer({ [name]: value })
  }

  const btnAnswer = async (id, userId) => {
    const formData = new FormData()
    formData.append('answer', answer.answer)
    formData.append('answeredBy', userId)

    try {
      await axios.put(`${api_answer}${id}`, formData)
      alert('đã trả lời khách hàng')
      fetchResetApi()
    } catch (error) {
      console.log('Error response:', error.response?.data)
    }
  }
  return (
    <CCard>
      <CCardHeader as="h5">Question by customer</CCardHeader>
      <CCardBody
        style={{
          display: 'flex',
          flexWrap: 'wrap', // cho phép xuống dòng khi không đủ chỗ
          gap: '1rem', // khoảng cách giữa các card
          justifyContent: 'flex-start',
        }}
      >
        {apiQuestion
          .filter((question) => question.answer === '' || question.answer === null)
          .map((question, index) => (
            <CCard key={index} style={{ width: '31.5rem' }}>
              <CCardBody>
                <CCardTitle>
                  {apiUsers.find((user) => user.idUser === question.userId)?.fullName || 'Unknown'}
                </CCardTitle>
                <CListGroupItem>
                  <CCallout color="warning">{question.question}</CCallout>
                </CListGroupItem>
                <CListGroupItem>
                  <CFormTextarea
                    aria-label="With textarea"
                    placeholder="answer customer questions..."
                    value={answer.value}
                    name="answer"
                    onChange={handleAnswer}
                  ></CFormTextarea>
                </CListGroupItem>
              </CCardBody>

              <CCardBody
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CCardLink href="#">show product</CCardLink>
                <CButton
                  color="danger"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => btnAnswer(question.id, question.userId)}
                >
                  Answer
                </CButton>
              </CCardBody>
            </CCard>
          ))}
      </CCardBody>
    </CCard>
  )
}
export default ProductQuestion
