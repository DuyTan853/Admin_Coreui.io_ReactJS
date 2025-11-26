import { useState, useEffect, useMemo, useCallback } from 'react'
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
import { allBrandsApi, allCategoriesApi, allSpecsApi } from '../../services/api.js'

const api_update_products = import.meta.env.VITE_API_UPDATE_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const FormUpdareProduct = ({ visible, product, Cancel, fetchResetApi }) => {
  const navigate = useNavigate() // hook của react-router-dom , dùng để chuyển page

  const [containerProduct, setContainerProduct] = useState({
    idProduct: product.idProduct,
    slug: product.slug,
    nameProduct: product.nameProduct,
    categoryId: product.categoryId,
    brandId: product.brandId,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    thumbnail: product.thumbnail,
    shortDesc: product.shortDesc,
    description: product.description,
    status: product.status,
    isFeatured: product.isFeatured,
    allowInstallment: product.allowInstallment,
    allowOnlinePrice: product.allowOnlinePrice,
  })
  console.log(product.categoryId)
  console.log(product.brandId)

  const [containerSpec, setContainerSpec] = useState({
    screenSize: product.specs.screenSize,
    screenTechnology: product.specs.screenTechnology,
    rearCamera: product.specs.rearCamera,
    frontCamera: product.specs.frontCamera,
    chipset: product.specs.chipset,
    internalMemory: product.specs.internalMemory,
    battery: product.specs.battery,
    operatingSystem: product.specs.operatingSystem,
    screenResolution: product.specs.screenResolution,
    screenFeatures: product.specs.screenFeatures,
    cpuType: product.specs.cpuType,
    compatibility: product.specs.compatibility,
    quantity: product.specs.quantity,
  })

  const [previewThumbnail, setPreviewThumbnail] = useState(
    product.thumbnail ? [{ preview: `${host_name}${product.thumbnail}` }] : [],
  ) // show image trực tiếp sau khi chọn file

  const [previewImages, setPreviewImages] = useState(
    product.images?.map((img) => ({
      preview: `${host_name}${img.imageUrl}`,
    })) || [],
  ) // show image trực tiếp sau khi chọn file

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

  // nhận id trả ra nameBrand
  const getBransNameById = (id) => apiBrands.find((item) => item.idBrand == id)?.nameBrand || ''

  // khai báo để hiển thị ra giá trị của apiBrands cho vào formselect
  const valueApiBrands = apiBrands?.map((item) => ({
    label: item.nameBrand,
    value: item.idBrand,
  }))

  // nhận id trả ra nameCategory
  const getCategoryNameById = (id) =>
    apiCategories.find((item) => item.idCate == id)?.nameCategory || ''

  // khai báo để hiển thị ra giá trị của apiCategories cho vào formSelect
  const valueApiCategories = apiCategories?.map((item) => ({
    label: item.nameCategory,
    value: item.idCate,
  }))

  // lấy ra key của spec
  // sử dụng useMemo để ko phải render lại khi thao tác , chỉ thay đổi khi apiSpecs có sự thay đổi
  const specKeys = useMemo(() => {
    return Object.keys(apiSpecs[0] || {})
      .filter((key) => key !== 'id')
      .map((key) => ({
        label: key,
        value: key,
      }))
  }, [apiSpecs])

  // khai báo hàm để hiển thị ra giá trị của apiSpecs theo key nhận được và cho vào formSelect
  const valueApiSpecs = useMemo(() => {
    const obj = {}
    specKeys.forEach((key) => {
      obj[key.value] = apiSpecs
        .filter((item) => item[key.value])
        .map((item) => ({
          label: formatLabel(item[key.value]),
          value: item[key.value],
        }))
    })
    return obj
  }, [apiSpecs, specKeys])

  // Khi người dùng chọn file thumnail
  const handleFileThumbnail = (e) => {
    const files = Array.from(e.target.files)
    const getPreviewThumbnail = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewThumbnail(getPreviewThumbnail)
    setThumbnail(files)
  }

  // Multiple photos
  // sử dụng useCallback để ko phải render khi ko cần thiết
  const handleFileImagesProduct = useCallback((e) => {
    const files = Array.from(e.target.files)
    const previewImage = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewImages(previewImage)
    setImagesFile(files)
  }, [])

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
  }

  const handleInputSpec = (e) => {
    const { name, value } = e.target
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
      await axios.patch(`${api_update_products}${containerProduct.idProduct}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('cập nhập sản phẩm thành công!')
    } catch (err) {
      console.error('Lỗi khi cập nhập sản phẩm:', err)
    }
    fetchResetApi()
    Cancel(true)
    navigate('/allproducts')
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
                  onClick={() => clickAddProduct()}
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
                          onChange={handleInputSpec}
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
                                ...valueApiSpecs[key.value],
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
        </CModalBody>
      </CModal>
    </>
  )
}
export default FormUpdareProduct
