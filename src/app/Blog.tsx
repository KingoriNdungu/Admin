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
  const [counter, setCounter] = useState(1);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [blogData, setBlogData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosApi.get("/blog-category/all");
      const res2 = await axiosApi.get("/sub-category/all");
      if (res.status === 200 || res.status === 201) {
        setCategories(res.data);
        setSubCategories(res2.data);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosApi.get(`/blog/all?page=${page}&limit=10`);
      setData(res.data);
    };
    fetchData();
  }, [page, counter]);

  const handleDecrease = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleIncrease = () => {
    if (data?.data?.length === 10) setPage(page + 1);
  };

  const getCategoryName = (id: any) =>
    categories?.find((item: any) => item?._id === id)?.name;

  const getSubCategoryName = (id: any) =>
    subCategories?.find((item: any) => item?._id === id)?.name;

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosApi.delete(`/blog/${id}`);
      toast.warn(res.data.message);
      setData((prevData: any) => ({
        ...prevData,
        data: prevData.data.filter((item: any) => item._id !== id),
      }));
    } catch {
      toast.error("Item doesn't exist");
    }
  };

  const handleEdit = (id: string) => {
    setOpen(true);
    setBlogData(data?.data?.find((item: any) => item._id === id));
  };

  return (
    <div className="w-full p-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-slate-300 px-4 py-2 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          Create Blog
        </button>
        <button
          className="bg-slate-300 px-4 py-2 rounded-lg"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          Create Blog Category
        </button>
        <button
          className="bg-slate-300 px-4 py-2 rounded-lg"
          onClick={() => setSubCategoryOpen(!subCategoryOpen)}
        >
          Create Blog Sub Category
        </button>
      </div>

      {open && (
        <Modal
          open={open}
          blogData={blogData}
          setBlogData={setBlogData}
          closeModal={() => setOpen(false)}
          setCounter={setCounter}
        />
      )}
      {categoryOpen && (
        <CategoryModal
          open={categoryOpen}
          closeModal={() => setCategoryOpen(false)}
        />
      )}
      {subCategoryOpen && (
        <SubCategoryModal
          open={subCategoryOpen}
          closeModal={() => setSubCategoryOpen(false)}
        />
      )}

      {/* Table Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 py-2 text-sm font-semibold">
        <p>Blog Name</p>
        <p>Category</p>
        <p>Subcategory</p>
        <p>Content</p>
        <p>Image</p>
        <p>Quotes</p>
        <p>Date Created</p>
      </div>

      {/* Table Content */}
      {data?.data?.map((item: any) => (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 py-4"
          key={item._id}
        >
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
              <span className="text-blue-600 cursor-pointer">...see more</span>
            )}
          </p>
          <div>
            <Image
              src={
                item?.image ||
                "https://res.cloudinary.com/dyxqzvej0/image/upload/v1732184905/blog_images/ojvkwhcic5jnrp1av9pa.jpg"
              }
              width={100}
              height={100}
              alt={item.name}
              className="rounded-lg"
            />
          </div>
          <p>{item.quotes.slice(0, 20)}...</p>
          <p className="flex gap-2 items-center">
            {item.date.slice(0, 10)}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              onClick={() => handleEdit(item._id)}
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
              onClick={() => handleDelete(item._id)}
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
        </section>
      ))}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
        <p>
          {data?.data?.length} items on page {data?.currentPage} of{" "}
          {data?.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <ArrowLeftIcon
            onClick={handleDecrease}
            className="w-5 h-5 cursor-pointer"
          />
          <p>
            {data?.currentPage} / {data?.totalPages}
          </p>
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
