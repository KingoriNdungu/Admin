"use client";
import React, { useEffect, useState } from "react";
import axiosApi from "@hooks/interceptor";
import Image from "next/image";
import Modal from "./Modal";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import CategoryModal from "./CategoryModal";
import SubCategoryModal from "./SubCategoryModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Blog = () => {
  const [data, setData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [counter,setCounter]=useState(1)
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [page, setPage] = useState(1);
  const isHTMLContent = (contentType: string) => contentType === "html";
  const closeModal = () => {
    setOpen(false);
  };
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosApi.get("/blog-category/all");
      const res2 = await axiosApi.get("/sub-category/all");
      if (res.status == 200 || res.status == 201) {
        setCategories(res.data);
        setSubCategories(res2.data);
      }
    };
    fetchCategories();
  }, []);
  const closeCategoryModal = () => {
    setCategoryOpen(false);
  };
  const closeSubCategoryModal = () => {
    setSubCategoryOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosApi.get(`/blog/all?page=${page}&limit=10`);
      setData(res.data);
    };
    fetchData();
  }, [page,counter]);
  console.log(page, "data");

  const handleDecrease = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const getCategoryName = (id: any) => {
    const category = categories?.find((item: any) => item?._id == id);
    return category?.name;
  };

  const getSubCategoryName = (id: any) => {
    const category = subCategories?.find((item: any) => item?._id == id);
    return category?.name;
  };
  const router=useRouter()
  const handleIncrease = () => {
    if (data.data.length < 10) return;
    setPage(page + 1);
  };

  const handleDelete=async(id:string)=>{

    try{
        const res=await axiosApi.delete(`/blog/${id}`)
        console.log(res)
        toast.warn(res.data.message)
        setData((prevData: any) => ({
            ...prevData,
            data: prevData.data.filter((item: any) => item._id !== id),
          }));
      
    }
    catch(err){
        toast.error("Item doesn't exist")
    }

  }
  const [blogData,setBlogData]=useState(null)
  const handleEdit=async(id:string)=>{

   setOpen(true)
   
   setBlogData(data.data.find((item: any) => item._id == id))
   console.log(blogData)
 
  
  }

  return (
    <div className="w-full">
      <div className="flex  space-x-6">
        <button
          className="bg-slate-300  p-2 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          Create Blog
        </button>
        <button
          className="bg-slate-300  p-2 rounded-lg"
          onClick={() => setCategoryOpen(!open)}
        >
          Create Blog Category
        </button>
        <button
          className="bg-slate-300  p-2 rounded-lg"
          onClick={() => setSubCategoryOpen(!open)}
        >
          Create Blog sub Category
        </button>
      </div>
      {open && <Modal open={open} blogData={blogData} setBlogData={setBlogData} closeModal={closeModal} setCounter={setCounter} />}
      {categoryOpen && (
        <CategoryModal open={categoryOpen} closeModal={closeCategoryModal} />
      )}
      {subCategoryOpen && (
        <SubCategoryModal
          open={subCategoryOpen}
          closeModal={closeSubCategoryModal}
        />
      )}

      <div className=" w-full grid grid-cols-7 py-2 capitalize !font-semibold !text-[20px]">
        <p> Blog name</p>
        <p>category</p>
        <p className="">subcategory</p>
        <p>content</p>
        <p>Blog Image</p>
        <p>quotes</p>
        <p>date created</p>
      </div>

      {data &&
        data.data &&
        data.data.length > 0 &&
        data.data.map((item: any) => {
          return (
            <section className="w-full space-y-2 " key={item._id}>
              <div className="w-full grid grid-cols-7 py-8 min-h-24">
                <p>{item.name}</p>
                <p>{getCategoryName(item.category)}</p>
                <p>{getSubCategoryName(item.sub_category)}</p>
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.content
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .substring(0, 50),
                    }}
                  />

                  {item.content.length > 200 && (
                    <span className="text-blue-600 cursor-pointer">
                      <br></br>...see more
                    </span>
                  )}
                </p>
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  alt={item.name}
                />
                <p>
                  {item.quotes.slice(0, 20)}{" "}
                  {item.content.length > 200 && (
                    <span className="text-blue-600 cursor-pointer">
                      <br></br>...see more
                    </span>
                  )}
                </p>
                <p className="flex gap-x-2">
                  {item.date.slice(0, 10)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    onClick={()=>handleEdit(item._id)}
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    
                    className="size-6 cursor-pointer hover:text-green-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    onClick={()=>handleDelete(item._id)}
                    stroke="currentColor"
                    className="size-6 cursor-pointer hover:text-red-700"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </p>
              </div>
            </section>
          );
        })}
      <div className="w-full flex flex-nowrap justify-between items-center pt-1  sticky z-50 bg-colorWhite -bottom-6 border-t col-span-6 border-bgBlack/10">
        <div className="flex items-center gap-2 shrink-0 min-w-[640px]">
          <h2 className="text-bgBlack/40">
            {data?.data?.length} items in {data?.currentPage} page
          </h2>
          <p>of {data?.totalItems} items</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            onChange={(e) => setPage(Number(e.target.value))}
            className="bg-black/10 py-2 px-4 min-w-14 flex items-center gap-1 outline-none rounded-full"
          >
            {Array.from([1, data.totalPages]).map((item, index) => (
              <option
                key={index}
                selected={data?.currentPage === item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
          <p>
            {" "}
            {data?.currentPage} page of {data?.totalPages}
          </p>
          <ArrowLeftIcon
            onClick={handleDecrease}
            className="w-5 h-5 cursor-pointer"
          />
          <ArrowRightIcon
            onClick={handleIncrease}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;
