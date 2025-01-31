import {
  ClipboardDocumentCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import axiosApi from "@hooks/interceptor";

export interface modalProps {
  open: boolean;
  closeModal: () => void;
  portfolioData: any;
  setPortfolioData: any;
  setCounter: any;
}

export interface FileObject {
  name: string;
  size: number;
  preview: string;
}

const Modal: React.FC<modalProps> = ({
  open,
  closeModal,
  setPortfolioData,
  portfolioData,
  setCounter,
}) => {
  const [title, setTitle] = useState(portfolioData?.title || "");
  const [description, setDescription] = useState(
    portfolioData?.description || "",
  );
  const [category, setCategory] = useState(portfolioData?.category || "");
  const [videoUrl, setVideoUrl] = useState(portfolioData?.videoUrl || "");
  const [categories, setCategories] = useState<any>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosApi.get("/blog-category/all");

      const res2 = await axiosApi.get("/sub-category/all");

      if (res.status == 200 || res.status == 201) {
        setCategories(res.data);
      }
    };
    fetchCategories();
  }, []);
  const [files, setFiles] = useState<FileObject[]>(
    portfolioData?.images?.length > 0
      ? portfolioData.images.map((img: string) => ({
          name: "default",
          size: 0,
          preview: img,
        }))
      : [],
  );
  const [images, setImages] = useState<any>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    console.log(selectedFiles, "selectedFiles");
    setImages(selectedFiles);
    if (selectedFiles) {
      const validFiles: FileObject[] = [];
      Array.from(selectedFiles).forEach((file) => {
        if (
          file.type !== "image/png" &&
          file.type !== "image/jpeg" &&
          file.type !== "image/jpg" &&
          file.type !== "application/pdf"
        ) {
          toast.error("Only png, jpeg, jpg, and pdf files are allowed");
        } else {
          validFiles.push({
            name: file.name,
            size: file.size,
            preview: URL.createObjectURL(file),
          });
        }
      });
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      category,
      videoUrl,
    };
    const formData = new FormData();
    images &&
      Array.from(images).forEach((file: any) => {
        console.log(file, "file");
        formData.append("files", file);
      });

    try {
      if (portfolioData?.title?.length > 0) {
        const res = await axiosApi.put(
          `/portfolio/${portfolioData?._id}`,
          payload,
        );
        if (res) {
          closeModal();
          console.log(formData, "formData");
          setCounter((prev: number) => prev + 1);
          toast.success("Portfolio updated successfully");
          setPortfolioData(null);
        }
      } else {
        const res = await axiosApi.post("/portfolio/create", payload);
        if (res) {
          closeModal();
          const res2 = await axiosApi.post(
            `/portfolio/create/images/${res.data._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Axios automatically handles this, but you can specify it
              },
            },
          );

          toast.success("Portfolio created successfully");
          setCounter((prev: number) => prev + 1);
          setPortfolioData(null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImages((prevImages: any[] = []) =>
      Array.from(prevImages).filter((_, i) => i !== index),
    );
  };

  const handleClose = () => {
    setPortfolioData(null);
    closeModal();
  };

  return (
    <div
      className={`$${
        open ? "block " : "hidden"
      }  z-[999]  bg-[#A0A3A9]/80 h-screen w-full overflow-scroll  fixed inset-x-0 top-0`}
    >
      <div className="wrapper !px-0 !py-0 h-full flex justify-end items-start ">
        <div className="md:max-w-[70vw] bg-white lg:max-w-[50vw] overflow-y-scroll space-y-2 w-full cartModal h-full  px-6 py-2">
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
          <form className="w-full space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                placeholder="Enter Portfolio Title"
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                placeholder="Enter Portfolio Description"
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="category">category</label>
              <select
                id="Name"
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
              >
                <option value="">select category</option>
                {categories &&
                  categories.length > 0 &&
                  categories.map((item: any) => {
                    return (
                      <option
                        key={item._id}
                        selected={item._id == category}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label htmlFor="videoUrl">Video URL</label>
              <input
                type="text"
                id="videoUrl"
                onChange={(e) => setVideoUrl(e.target.value)}
                value={videoUrl}
                className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                placeholder="Enter Video URL"
              />
            </div>
            <div className="relative !border-[#D1D5DB] normalBorder !border !border-black !rounded-2xl flex justify-center flex-col items-center border-dashed px-4 py-4 w-full min-h-16 cursor-pointer">
              <label className="w-full h-full bg-colorWhite">
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="absolute inset-0 w-full h-full hidden cursor-pointer"
                  multiple
                />
                <div className="w-full flex flex-col gap-2 h-full items-center justify-center">
                  <p className="!text-PrimaryOrange smallText cursor-pointer">
                    Click to upload your Porfolio Images
                  </p>
                  <p className="smallText cursor-pointer">
                    1200 x 1600 (3:4) recommended
                  </p>
                </div>
              </label>
              <div className="flex flex-wrap gap-4 mt-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden w-24 h-24"
                  >
                    <Image
                      src={file.preview}
                      width={96}
                      height={96}
                      alt={file.name}
                      className="object-cover"
                    />
                    <XMarkIcon
                      className="absolute top-1 right-1 w-6 h-6 cursor-pointer"
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e)
              }
              className="w-full py-2 rounded-xl outline-bgBlack bg-black text-white"
            >
              {portfolioData?.title?.length > 0 ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
