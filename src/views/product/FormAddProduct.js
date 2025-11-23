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
  CFormTextarea,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCloudUpload } from '@coreui/icons'
import imageUpLoadEmpty from '/public/image.png'
import { v4 as uuidv4 } from 'uuid' // thư viện cung cấp id unique toàn cầu
import { allBrandsApi, allCategoriesApi, allSpecsApi } from '../../services/api.js'

const api_add_products = import.meta.env.VITE_API_ADD_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

function FormAddProduct() {
  const navigate = useNavigate() // hook của react-router-dom , dùng để chuyển page

  const [containerProduct, setContainerProduct] = useState({
    idProduct: 'PROD-001',
    slug: 'iphone-15-pro-max',
    nameProduct: 'iPhone 15 Pro Max',
    categoryId: '1', // id giả sử của category
    brandId: '1', // id giả sử của brand
    price: '32990000',
    originalPrice: '34990000',
    discountPercent: 10,
    thumbnail: '',
    shortDesc: 'Điện thoại cao cấp nhất của Apple.',
    description: 'Mô tả chi tiết sản phẩm iPhone 15 Pro Max...',
    status: 'available',
    isFeatured: true,
    allowInstallment: true,
    allowOnlinePrice: true,
    createAt: new Date(),
    updateAt: new Date(),
  })
  const [containerSpec, setContainerSpec] = useState({
    productId: containerProduct.idProduct, // hoặc id test
    screenSize: '6.8 inch',
    screenTechnology: 'Dynamic AMOLED 2X',
    rearCamera: '200MP + 12MP + 12MP',
    frontCamera: '40MP',
    chipset: 'Exynos 2400',
    internalMemory: '512GB',
    battery: '5000 mAh',
    operatingSystem: 'Android 14',
    screenResolution: '3088 x 1440',
    screenFeatures: '120Hz, HDR10+',
    cpuType: 'Octa-core',
    compatibility: '5G, Wi-Fi 7, Bluetooth 5.3',
    quantity: 15,
  })
  const [previewThumbnail, setPreviewThumbnail] = useState([]) // show image trực tiếp sau khi chọn file
  const [previewImages, setPreviewImages] = useState([]) // show image trực tiếp sau khi chọn file
  const [thumbnailFile, setThumbnail] = useState([])
  const [imagesFile, setImagesFile] = useState([])
  const [apiBrands, setApiBrands] = useState([])
  const [apiCategories, setApiCategories] = useState([])
  const [apiSpecs, setApiSpecs] = useState([])

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // call api BRANDS
        const resultApiBrands = await allBrandsApi()
        setApiBrands(resultApiBrands.brands)

        // call api CATEGORIES
        const resultApiCategories = await allCategoriesApi()
        setApiCategories(resultApiCategories.categories)

        // call api SPECS
        const resultApiSpecs = await allSpecsApi()
        setApiSpecs(resultApiSpecs.specs)
      } catch (error) {
        console.log('fetchApi error:', error)
      }
    }
    fetchApi()
  }, [])

  // sửa chuỗi , tách khoảng với trước chữ in hoa và in hoa chữ
  function formatLabel(text) {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // không tách giữa chữ viết tắt
      .replace(/^./, (char) => char.toUpperCase())
  }

  // nhận id trả ra category
  const getBransNameById = (id) => apiBrands.find((item) => item.idBrand == id)?.nameBrand || ''

  // khai báo để hiển thị ra giá trị của apiBrands cho vào formselect
  const valueApiBrands = apiBrands?.map((item) => ({
    label: item.nameBrand,
    value: item.idBrand,
  }))

  // nhận id trả ra category
  const getCategoryNameById = (id) =>
    apiCategories.find((item) => item.idCate == id)?.nameCategory || ''

  // khai báo để hiển thị ra giá trị của apiCategories cho vào formSelect
  const valueApiCategories = apiCategories?.map((item) => ({
    label: item.nameCategory,
    value: item.idCate,
  }))

  // khai báo hàm để hiển thị ra giá trị của apiSpecs theo key nhận được và cho vào formSelect
  const valueApiSpecs = (key) =>
    apiSpecs
      ?.filter((item) => item[key] !== null && item[key] !== undefined && item[key] !== '')
      .map((item) => ({
        label: formatLabel(item[key]),
        value: item[key],
      }))

  // lấy ra key của spec
  const specKeys = Object.keys(apiSpecs[0] || [])
    .filter((key) => key !== 'id')
    ?.map((key) => ({
      label: key,
      value: key,
    }))

  // Khi người dùng chọn file thumnail
  const handleFileThumbnail = (e) => {
    const files = Array.from(e.target.files)
    const previewThumbnail = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewThumbnail(previewThumbnail)
    setThumbnail(files)
  }

  // Multiple photos
  const handleFileImagesProduct = (e) => {
    const files = Array.from(e.target.files)
    const previewImage = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewImages(previewImage)
    setImagesFile(files)
    console.log(imagesFile)
  }

  // function use uuid , create id
  const randomIdProduct = () => {
    return `${uuidv4()}`
  }

  // create slug by name product
  const createSlugByNameProduct = (nameProduct) => {
    return nameProduct.toLowerCase().replace(/\s+/g, '-')
  }

  // event follow form input
  const handleInputForm = (e) => {
    const { name, value, type, checked } = e.target

    setContainerProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'nameProduct' && { slug: createSlugByNameProduct(value) }),
    }))
    setContainerSpec((prev) => ({ ...prev, [name]: value }))
  }

  // event selection form
  const handleSelectionFormProduct = (e) => {
    const { name, value } = e.target
    setContainerProduct((prev) => ({ ...prev, [name]: value }))

    // console.log(containerSpec)
  }

  const handleSelectionFormSpecs = (e, key) => {
    const { value } = e.target
    setContainerSpec((prev) => ({ ...prev, [key]: value }))

    // console.log(containerSpec)
  }

  // button add publish send request to server
  const clickAddProduct = async () => {
    const formData = new FormData()

    const finalProduct = {
      ...containerProduct,
      idProduct: randomIdProduct(),
      specs: [containerSpec], // bọc trong mảng ở backend khai specs là 1 bảng riêng
      images: imagesFile.map((file) => file.name),
    }

    formData.append('thumbnailPath', thumbnailFile[0])

    imagesFile.forEach((file) => {
      formData.append('imagesFile', file)
    })

    formData.append('FinalProduct', JSON.stringify(finalProduct))
    console.log(imagesFile)
    console.log(thumbnailFile)
    try {
      await axios.post(`${api_add_products}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Tạo sản phẩm thành công!')
    } catch (err) {
      console.error('Lỗi khi tạo sản phẩm:', err)
    }
    // navigate('/allproducts')
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3}>
            <CButton
              color="primary"
              type="submit"
              className="fw-bold mb-2 mt-2"
              onClick={() => clickAddProduct()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={8}>
                <CRow>
                  <CCol sm={12}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Name product"
                      name="nameProduct"
                      value={containerProduct.nameProduct}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Short description"
                      name="shortDesc"
                      value={containerProduct.shortDesc}
                      onChange={handleInputForm}
                    />
                    <CFormTextarea
                      className="mb-3"
                      label="Detail description"
                      rows="6"
                      name="description"
                      value={containerProduct.description}
                      onChange={handleInputForm}
                    ></CFormTextarea>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm={6}>
                    <CFormSelect
                      className="mb-3"
                      name="brandId"
                      label="Brand"
                      options={[
                        {
                          label:
                            getBransNameById(containerProduct.brandId) ||
                            '- - - Select brand - - -',
                          value: '',
                        },
                        ...valueApiBrands,
                      ]}
                      onChange={(e) => handleSelectionFormProduct(e)}
                    />
                    <CFormSelect
                      className="mb-3"
                      label="Category"
                      name="categoryId"
                      options={[
                        {
                          label:
                            getCategoryNameById(containerProduct.categoryId) ||
                            '- - - Select Category - - -',
                          value: '',
                        },
                        ...valueApiCategories,
                      ]}
                      onChange={(e) => handleSelectionFormProduct(e)}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Original Price"
                      name="originalPrice"
                      value={containerProduct.originalPrice}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Price"
                      name="price"
                      value={containerProduct.price}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Discount"
                      name="discountPercent"
                      value={containerProduct?.discountPercent}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Quantity"
                      name="quantity"
                      value={containerSpec?.quantity}
                      onChange={handleInputForm}
                    />
                    <CFormSelect
                      className="mb-3"
                      label="Status"
                      name="status"
                      options={[
                        { label: '- - - Select status - - -', value: '' },
                        { label: 'Còn hàng', value: 'Còn hàng' },
                        { label: 'Hết hàng', value: 'Hết hàng' },
                      ]}
                      onChange={(e) => handleSelectionFormProduct(e)}
                    />
                    <CFormCheck
                      className="big-checkbox mb-3"
                      type="checkbox"
                      id="flexRadioDefault1"
                      label="Allow intallment"
                      name="allowInstallment"
                      checked={containerProduct.allowInstallment}
                      onChange={handleInputForm}
                    />
                    <CFormCheck
                      className="big-checkbox"
                      type="checkbox"
                      id="flexRadioDefault2"
                      label="Allow online price"
                      name="allowOnlinePrice"
                      checked={containerProduct.allowOnlinePrice}
                      onChange={handleInputForm}
                    />
                  </CCol>
                  <CCol sm={6}>
                    {apiSpecs &&
                      specKeys?.map((key, index) => (
                        <CFormSelect
                          key={index}
                          className="mb-3 custom-dropdown-full"
                          label={formatLabel(key.label)} // dùng từng key làm label
                          options={[
                            {
                              label:
                                containerSpec[key.label] ||
                                `- - - Select ${formatLabel(key.label)} - - -`,
                              value: '',
                            },
                            ...valueApiSpecs(key.value),
                          ]}
                          onChange={(e) => handleSelectionFormSpecs(e, key.label)}
                        />
                      ))}
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={4}>
                <CFormInput
                  className="mb-3"
                  type="file"
                  label="Thumbnail"
                  multiple
                  name="thumbnail"
                  onChange={handleFileThumbnail}
                />
                {/* Hiển thị ảnh xem trước */}
                {previewThumbnail.length > 0 ? (
                  previewThumbnail.map((img, index) => (
                    <img
                      key={index}
                      src={img.preview}
                      alt={`preview-${index}`}
                      className="mb-3 img-fluid rounded shadow-sm"
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
                      className="mb-3 img-fluid rounded shadow-sm "
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                    />
                  </>
                )}

                {/* add images */}
                <CFormInput
                  className="mb-3"
                  type="file"
                  label="Images product(Multiple photos can be selected)"
                  multiple
                  name="thumbnail"
                  onChange={handleFileImagesProduct}
                />
                {/* Hiển thị ảnh xem trước */}
                {previewImages.length > 0 ? (
                  previewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.preview}
                      alt={`preview-${index}`}
                      className="mb-3 img-fluid rounded shadow-sm"
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
                      className="mb-3img-fluid rounded shadow-sm "
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
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormAddProduct
