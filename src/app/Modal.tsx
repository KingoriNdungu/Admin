import {
  ClipboardDocumentCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import "react-quill-new/dist/quill.snow.css";

import { toast } from "react-toastify";
import Image from "next/image";
import axiosApi from "@hooks/interceptor";

export interface modalProps {
  open: boolean;
  closeModal: () => void;
  blogData: any;
  setBlogData: any;
  setCounter: any;
}

export interface FileObject {
  name: string;
  size: number;
}
const Modal: React.FC<modalProps> = ({
  open,
  closeModal,
  setBlogData,
  blogData,
  setCounter,
}) => {
  const [value, setValue] = useState(blogData?.content);
  const [name, setName] = useState(blogData?.name);
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [content, setContent] = useState("");
  const [quotes, setQuotes] = useState(blogData?.quotes);
  const [file, setFile] = useState<FileObject>(
    blogData?.image?.length > 0
      ? { name: "default", size: 10 }
      : { name: "", size: 0 },
  );
  const [uploadfile, setUploadFile] = useState<any>({});
  const [uploadfileurl, setUploadFileUrl] = useState(blogData?.image);
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(
    blogData?.category,
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(
    blogData?.sub_category,
  );
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      name,
      category: selectedCategory,
      sub_category: selectedSubCategory,
      content: value,
      quotes,
    };
    const formdata = new FormData();
    formdata.append("file", uploadfile);
    console.log(payload);
    if (blogData?.name?.length > 0) {
      const res = await axiosApi.put(`/blog/${blogData?._id}`, payload);

      if (res) {
        closeModal();
        setCounter((prev: number) => prev + 1);
        toast.success("blog updated successfully");
        setBlogData(null);
      }
    } else {
      const res = await axiosApi.post("/blog/create", payload);

      if (res) {
        closeModal();
        const res2 = await axiosApi.post(
          `/blog/create/image/${res.data._id}`,
          formdata,
        );
        toast.success("blog created successfully");
        setCounter((prev: number) => prev + 1);
        setBlogData(null);
      }
      console.log(res, res.data, res.data._id);
    }
  };
  console.log(uploadfile);
  const handleClose = () => {
    setBlogData(null);
    closeModal();
  };
  return (
    <div
      className={`${
        open ? "block " : "hidden"
      }  z-[999]  bg-[#A0A3A9]/80 h-screen w-full overflow-scroll  fixed inset-x-0 top-0`}
    >
      <div className=" wrapper !px-0 !py-0 h-full flex justify-end items-start ">
        <div className="md:max-w-[70vw] bg-white lg:max-w-[50vw] overflow-y-scroll   space-y-2 w-full cartModal h-full  px-6 py-2">
          <div className="flex  w-full justify-between items-center">
            <button
              onClick={handleClose}
              className="z-50 bg-primaryGray p-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ClipboardDocumentCheckIcon className="w-8 h-8" />
          </div>
          <form className="w-full space-y-4 ">
            <div>
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                id="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                placeholder="Enter Blog Name"
              />
            </div>
            <div>
              <label htmlFor="category">category</label>
              <select
                id="Name"
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
              >
                <option value="">select category</option>
                {categories &&
                  categories.length > 0 &&
                  categories.map((item: any) => {
                    return (
                      <option
                        key={item._id}
                        selected={item._id == selectedCategory}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label htmlFor="sub_category">sub_category</label>
              <select
                id="Name"
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
              >
                <option value="">select sub category</option>
                {subCategories &&
                  subCategories.length > 0 &&
                  subCategories.map((item: any) => {
                    return (
                      <option
                        key={item._id}
                        selected={item._id == selectedSubCategory}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label htmlFor="store_address">content</label>
              <ReactQuill
                theme="snow"
                className=""
                value={value}
                onChange={setValue}
              />
            </div>

            <div className="relative !border-[#D1D5DB] normalBorder box-border !rounded-2xl flex justify-center flex-col items-center border-dashed px-4 py-4 w-full min-h-16 cursor-pointer">
              <label className="w-full h-full bg-colorWhite">
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = e.target.files && e.target.files[0];
                    if (
                      selectedFile?.type !== "image/png" &&
                      selectedFile?.type !== "image/jpeg" &&
                      selectedFile?.type !== "image/jpg" &&
                      selectedFile?.type !== "application/pdf"
                    ) {
                      toast.error(
                        "Only png, jpeg, jpg and pdf files are allowed",
                      );
                      return;
                    }
                    if (selectedFile) {
                      setFile({
                        name: selectedFile.name,
                        size: selectedFile.size,
                      });
                      setUploadFile(selectedFile);
                      setUploadFileUrl(URL.createObjectURL(selectedFile));
                    }
                  }}
                  type="file"
                  className="absolute inset-0 w-full h-full hidden cursor-pointer"
                />
                {file?.name !== "" || file?.size !== 0 ? (
                  <div className="flex w-full h-full gap-x-2 md:gap-x-0 md:justify-between items-center">
                    <Image src={uploadfileurl} width={60} height={60} alt="" />
                    <div>
                      <p className="!text-PrimaryOrange smallText cursor-pointer max-w-[80%] md:max-w-fit">
                        {file?.name}
                      </p>
                      <p className="smallText cursor-pointer">
                        {(file.size / 1000000).toFixed(2)} MB
                      </p>
                    </div>
                    <XMarkIcon
                      className="w-6 h-6 z-50"
                      onClick={() => {
                        setFile({ name: "", size: 0 });
                        setUploadFileUrl("");
                        setUploadFile("");
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-2 h-full items-center justify-center">
                    <p className="!text-PrimaryOrange smallText cursor-pointer">
                      Click to upload your profile Image
                    </p>
                    <p className="smallText cursor-pointer">
                      1200 x 1600 (3:4) recommended
                    </p>
                  </div>
                )}
              </label>
            </div>
            <div>
              <label htmlFor="quotes">quotes</label>
              <input
                type="text"
                id="quotes"
                onChange={(e) => setQuotes(e.target.value)}
                value={quotes}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                placeholder="Enter Blog Quotes"
              />
            </div>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e)
              }
              className="w-full py-2 rounded-xl outline-bgBlack bg-black text-white "
            >
              {blogData?.name?.length > 0 ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
