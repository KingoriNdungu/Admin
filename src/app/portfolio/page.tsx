import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'


import axiosApi from './interceptor'
import Modal from './Modal'
// In page.tsx
import CategoryModal from './CategoryModal'
import SubCategoryModal from './SubCategoryModal'
const Page = () => {
  const [data, setData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subCategoryOpen, setSubCategoryOpen] = useState(false)
  const [page, setPage] = useState(1)
  const isHTMLContent = (contentType: string) => contentType === 'html';
  const closeModal = () => {
      setOpen(false)
  
}





  const [categories, setCategories] = useState<any>([])
  const [subCategories, setSubCategories] = useState<any>([])
  useEffect(() => {
      const fetchCategories = async () => {
          const res = await axiosApi.get('/portfolio-category/all')
          const res2 = await axiosApi.get('/sub-category/all')
          if (res.status == 200 || res.status == 201) {
              setCategories(res.data)
              setSubCategories(res2.data)
          }
      }
      fetchCategories()
  }, [])
  const closeCategoryModal = () => {
      setCategoryOpen(false)
  }
  const closeSubCategoryModal = () => {
      setSubCategoryOpen(false)
  }

  useEffect(() => {
      const fetchData = async () => {
          const res = await axiosApi.get(`/blog/all?page=${page}&limit=10`)
          setData(res.data)
      }
      fetchData()

  }, [page])
  console.log(page, "data")

  const handleDecrease = () => {
      if (page === 1) return
      setPage(page - 1)

  }

  const getCategoryName = (id: any) => {
      const category = categories?.find((item: any) => item?._id == id)
      return category?.name
  }

  const getSubCategoryName = (id: any) => {
      const category = subCategories?.find((item: any) => item?._id == id)
      return category?.name
  }

  const handleIncrease = () => {
      if (data.data.length < 10) return
      setPage(page + 1)

  }

  return (
      <div className='w-full'>
          <div className='flex  space-x-6'>


              <button className='bg-slate-300  p-2 rounded-lg' onClick={() => setOpen(!open)}>Create Blog</button>
              <button className='bg-slate-300  p-2 rounded-lg' onClick={() => setCategoryOpen(!open)}>Create Blog Category</button>
              <button className='bg-slate-300  p-2 rounded-lg' onClick={() => setSubCategoryOpen(!open)}>Create Blog sub Category</button>
          </div>
          {

              open && <Modal open={open} closeModal={closeModal} />
          }
          {

              categoryOpen && <CategoryModal open={categoryOpen} closeModal={closeCategoryModal} />
          }
          {

              subCategoryOpen && <SubCategoryModal open={subCategoryOpen} closeModal={closeSubCategoryModal} />
          }

          <div className=' w-full grid grid-cols-7 py-2 capitalize !font-semibold !text-[20px]'>


              <p > SAHARA PRODUCTIONS</p>
              <p>about us</p>
              <p className=''>subcategory</p>
              <p>projects</p>
              <p>quotes</p>
              <p>contacts</p>
              <p>date created</p>
          </div>

          {
              data && data.data && data.data.length > 0 && data.data.map((item: any) => {
                  return (
                      <section className='w-full space-y-2' key={item._id}>


                          <div className='w-full grid grid-cols-7 min-h-24'>


                              <p >{item.name}</p>
                              <p>{getCategoryName(item.category)}</p>
                              <p>{getSubCategoryName(item.sub_category)}</p>
                              <p>

                                  <span dangerouslySetInnerHTML={{ __html: item.content.slice(0, 200) }} />
                                  {item.content.length > 200 && <span className='text-blue-600 cursor-pointer'>...see more</span>}
                              </p>
                              <Image src={item.image} width={100} height={100} alt={item.name} />
                              <p>{item.quotes.slice(0, 100)}  {item.content.length > 200 && <span className='text-blue-600 cursor-pointer'>...see more</span>}</p>
                              <p>{item.date.slice(0, 10)}</p>
                          </div>
                      </section>
                  )
              })


          }
          <div className='w-full flex flex-nowrap justify-between items-center pt-1  sticky z-50 bg-colorWhite -bottom-6 border-t col-span-6 border-bgBlack/10'>
              <div className='flex items-center gap-2 shrink-0 min-w-[640px]'>
                  <h2 className='text-bgBlack/40'>{data?.data?.length} items in {data?.currentPage} page</h2>
                  <p>of {data?.totalItems} items</p>
              </div>

              <div className='flex items-center gap-3 shrink-0'>

                  <select onChange={(e) => setPage(Number(e.target.value))} className='bg-black/10 py-2 px-4 min-w-14 flex items-center gap-1 outline-none rounded-full'>
                      {
                          Array.from([1, data.totalPages]).map((item, index) => <option key={index} selected={data?.currentPage === item} value={item}>{item}</option>)
                      }

                  </select>
                  <p> {data?.currentPage} page of {data?.totalPages}</p>
                  <ArrowLeftIcon onClick={handleDecrease} className="w-5 h-5 cursor-pointer" />
                  <ArrowRightIcon onClick={handleIncrease} className="w-5 h-5 cursor-pointer" />
              </div>
          </div>

      </div>
  )
}

export default Page
