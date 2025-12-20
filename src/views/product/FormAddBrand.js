import { useEffect, useState } from 'react'
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
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilPencil, cilCloudUpload } from '@coreui/icons'
import imageUpLoad from '/public/image.png'
import { callApi } from '../../services/api'

// define api link
const api_all_brands = import.meta.env.VITE_API_SHOW_BRANDS
const api_add_brand = import.meta.env.VITE_API_ADD_BRAND
const api_update_brand = import.meta.env.VITE_API_UPDATE_BRAND
const api_delete_brand = import.meta.env.VITE_API_DELETE_BRAND
const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
const host_name_uploads = import.meta.env.VITE_HOST_NAME_UPLOADS

function FormAddBrand() {
  const [allBrands, setAllBrands] = useState([]) // chứa data từ api brand
  const [containerBrands, setContainerBrands] = useState({
    id: '',
    nameBrand: '',
    category: '',
    logo: '',
  })
  const [apiCategories, setApiCategories] = useState([])
  const [previewImages, setPreviewImages] = useState([]) // show image trực tiếp sau khi chọn file
  const [image, setImage] = useState([])
  const [imageUpLoadEmpty, setImageUpLoadEmpty] = useState(imageUpLoad)
  // gọi api và thực hiện show brand
  const CBFetchAllBrands = async () => {
    //nếu tách fetchAllBrand khỏi useEffect thì bị báo lỗi eslint nên tạo hẳn hàm mới cho việc gọi lại api khi CRUD brand mới
    try {
      const result = await callApi(api_all_brands)
      setAllBrands(result.brands)
    } catch (error) {
      console.log('call api error:', error)
    }
  }
  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const result = await callApi(api_all_brands)
        setAllBrands(result.brands)

        // call api CATEGORIES
        const resultApiCategories = await callApi(api_all_categories)
        setApiCategories(resultApiCategories.categories)
      } catch (error) {
        console.log('call api error:', error)
      }
    }
    fetchAllBrands()
  }, [])

  // khai báo để hiển thị ra giá trị của apiCategories cho vào formSelect
  const valueApiCategories = apiCategories?.map((item) => ({
    label: item.nameCategory,
    value: item.nameCategory,
  }))
  // event selection form
  const selectionCategory = (e) => {
    const { name, value } = e.target
    setContainerBrands((prev) => ({ ...prev, [name]: value }))

    // console.log(containerSpec)
  }
  // Khi người dùng chọn file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const previewImage = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewImages(previewImage)
    setImage(files)
    console.log(e.target.files[0])
  }

  // event follow form input
  const handleChange = (e) => {
    const { name, value } = e.target
    setContainerBrands((prev) => ({ ...prev, [name]: value || '' }))

    console.log(containerBrands)
  }
  const clickAddOrUpdateProduct = () => {
    if (containerBrands.id === '') {
      addBrand()
    } else {
      updateBrand(containerBrands.id)
    }
  }

  // button add publish send request to server
  const addBrand = async () => {
    const formData = new FormData()

    formData.append('logo', image[0])
    formData.append('nameBrand', containerBrands.nameBrand)
    formData.append('category', containerBrands.category)

    try {
      const res = await axios.post(`${api_add_brand}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('thêm brand thành công!')
      console.log(res.data)
    } catch (err) {
      console.error('Lỗi khi tạo brand:', err)
    }

    // reload list và reset form
    CBFetchAllBrands()
    setContainerBrands({ id: '', nameBrand: '', category: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
  }

  // edit brand
  const clickShowEditBrandById = async (id, nameBrand, category, logo) => {
    setContainerBrands({ id, nameBrand, category, logo })
    setImageUpLoadEmpty(`${host_name_uploads}${logo}`)
  }

  const updateBrand = async (id) => {
    const formData = new FormData()
    formData.append('nameBrand', containerBrands.nameBrand)
    formData.append('category', containerBrands.category)
    if (image.length > 0) formData.append('logo', image[0]) // chỉ append nếu có ảnh mới

    try {
      await axios.patch(`${api_update_brand}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Sửa brand thành công!')
      // reload list và reset form
      CBFetchAllBrands()
      setContainerBrands({ id: '', nameBrand: '', category: ' ', logo: '' })
      setImageUpLoadEmpty(imageUpLoad)
      setPreviewImages([])
      setImage([])
    } catch (err) {
      console.error('Lỗi khi sửa brand:', err)
      alert('Sửa brand thất bại!')
    }
  }

  // button cancel update
  const clickCancelBrand = () => {
    setContainerBrands({ id: '', nameBrand: '', category: ' ', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
  }

  // delete brand
  const clickDeleteProductById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa brand này?')) return

    try {
      await axios.delete(`${api_delete_brand}${id}`)
      alert('Xóa brand thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa brand:', err)
      alert('Xóa brand thất bại!')
    }
    // reload list và reset form
    CBFetchAllBrands()
    setContainerBrands({ id: '', nameBrand: '', category: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
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
              onClick={() => clickAddOrUpdateProduct()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {containerBrands.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={() => clickCancelBrand()}
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
                      label="Name Brand"
                      name="nameBrand"
                      value={containerBrands.nameBrand}
                      onChange={handleChange}
                    />
                    <CFormSelect
                      className="mb-3"
                      aria-label="Default select example"
                      name="category"
                      value={containerBrands.category || ''}
                      options={[
                        {
                          label: containerBrands.category || '- - - Select Category - - -',
                          value: '',
                        },
                        ...valueApiCategories, // thêm từ API
                      ]}
                      onChange={(e) => selectionCategory(e)} // lưu value
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      className="mb-3"
                      type="file"
                      id="formFileMultiple"
                      label="Upload images"
                      multiple
                      name="thumbnail"
                      onChange={handleFileChange}
                    />
                    {/* Hiển thị ảnh xem trước */}
                    {previewImages.length > 0 ? (
                      previewImages.map((img, index) => (
                        <img
                          key={index}
                          src={img.preview}
                          alt={`preview-${index}`}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                        />
                      ))
                    ) : (
                      <>
                        <img
                          src={imageUpLoadEmpty}
                          alt="upload image"
                          className="img-fluid rounded shadow-sm "
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                        />
                      </>
                    )}
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={8}>
                <CCardBody>
                  <CTable bordered striped hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Logo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name brand</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category</CTableHeaderCell>

                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {allBrands.length > 0 ? (
                        allBrands.map((brand, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              <img
                                src={`${host_name_uploads}${brand.logo}`}
                                alt={brand.logo}
                                className="brand-image"
                              />
                            </CTableHeaderCell>
                            <CTableDataCell>{brand.nameBrand}</CTableDataCell>
                            <CTableDataCell>{brand.category}</CTableDataCell>

                            <CTableDataCell>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <CButton
                                  color="primary"
                                  onClick={() =>
                                    clickShowEditBrandById(
                                      brand.idBrand,
                                      brand.nameBrand,
                                      brand.category,
                                      brand.logo,
                                    )
                                  }
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  onClick={() => clickDeleteProductById(brand.idBrand)}
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

export default FormAddBrand
