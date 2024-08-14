import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import axiosApi from './hooks/interceptor'

export interface modalProps {
    open: boolean
    closeModal: () => void
}
const SubCategoryModal: React.FC<modalProps> = ({ open, closeModal }) => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState<any>([])
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axiosApi.get('/blog-category/all')
            if (res.status == 200 || res.status == 201) {
                setCategories(res.data)
            }
        }
        fetchCategories()
    }, [])
    const handleSubmit = async (e: any) => {

        e.preventDefault()
        const payload = {
            name,
            category: selectedCategory
        }
        const res = await axiosApi.post('/sub-category/create', payload)
        if (res.status == 200 || res.status == 201) {
            closeModal()
        }
    }
    return (
        <div className={`${open ? "block " : "hidden"}  z-[999]  bg-[#A0A3A9]/80 h-screen w-full overflow-scroll  fixed inset-x-0 top-0`}>
            <div className=' wrapper !px-0 !py-0 h-full flex justify-end items-start '>


                <div className='md:max-w-[70vw] bg-white lg:max-w-[50vw] overflow-y-scroll   space-y-2 w-full cartModal h-full  px-6 py-2'>

                    <div className="flex  w-full justify-between items-center">
                        <button onClick={() => closeModal()} className="z-50 bg-primaryGray p-1 rounded-full">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ClipboardDocumentCheckIcon className="w-8 h-8" />
                    </div>
                    <form className='w-full space-y-4 '>

                        <div>
                            <label htmlFor="Name">Name</label>
                            <input type="text" id="Name" onChange={(e) => setName(e.target.value)} value={name} className='w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6' placeholder="Enter subcategory name" />

                        </div>
                        <div>
                            <label htmlFor="Name">Category</label>
                            <select id="Name" onChange={(e) => setSelectedCategory(e.target.value)} className='w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6'>
                                <option value="">select category</option>
                                {
                                    categories && categories.length > 0 && categories.map((item: any) => {
                                        return <option key={item._id} value={item._id}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)} className='w-full py-2 rounded-xl outline-bgBlack bg-black text-white '>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SubCategoryModal