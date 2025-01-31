"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeDropperIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axiosApi from "@hooks/interceptor";
import Image from "next/image";
import Modal from "./Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import CategoryModal from "./CategoryModal";
import SubCategoryModal from "./SubCategoryModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

const Portfolio = () => {
  const [data, setData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(1);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [showMiniserviceModal, setShowMiniserviceModal] = useState(false);
  const [miniservice, setMiniservice] = useState<any>(null);

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
      const res = await axiosApi.get(`/services/all?page=${page}&limit=10`);
      setData(res.data);
    };
    fetchData();
  }, [page, counter]);

  const handleImageClick = (images: string[]) => {
    setSelectedImages(images);
    setShowModal(true);
  };

  const handleOpen = (url: string) => {
    setVideoUrl(url);
    setShowVideoModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosApi.delete(`/services/${id}`);
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
    setPortfolioData(data?.data?.find((item: any) => item._id === id));
  };

  const handleMiniserviceClick = (title: string, description: string) => {
    setMiniservice({ title, description });
    setShowMiniserviceModal(true);
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-slate-300 px-4 py-2 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          Create Service
        </button>
      </div>

      {open && (
        <Modal
          open={open}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          closeModal={() => setOpen(false)}
          setCounter={setCounter}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 py-2 text-sm font-semibold">
        <p>Title</p>
        <p>Description</p>
        <p>Miniservice</p>
        <p>Image</p>
        <p>Video</p>
        <p>Date Created</p>
      </div>

      {data?.data?.map((item: any) => (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 py-4"
          key={item._id}
        >
          <p>{item.title}</p>
          <p>{item?.description?.substring(0, 50)}...</p>

          <div className="flex flex-col gap-1">
            {item?.miniService?.map(
              (service: { title: any; description: string }) => {
                return (
                  <button
                    key={service?.title} // Always use a unique key for list items in React
                    className="text-blue-500 hover:underline"
                    onClick={() =>
                      handleMiniserviceClick(
                        service?.title,
                        service?.description,
                      )
                    }
                  >
                    {service?.title}
                  </button>
                );
              },
            )}
          </div>

          <div>
            <Image
              src={item?.images?.[0] || "/default-image.jpg"}
              width={100}
              height={100}
              alt={item?.title}
              className="rounded-lg cursor-pointer"
              onClick={() => handleImageClick(item.images)}
            />
          </div>
          <button
            className="flex items-center gap-1"
            onClick={() => handleOpen(item.videoUrl)}
          >
            View Video
          </button>
          <p>{new Date(item.date_created).toLocaleDateString()}</p>
          <p className="flex gap-2 items-center">
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

      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div></div>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-2 right-2 text-black bg-white p-2 rounded-full hover:text-gray-600 transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <ReactPlayer url={videoUrl} />
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-50 text-gray-900 hover:text-red-900"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              spaceBetween={20}
              slidesPerView={1}
              className="h-full w-full"
            >
              {selectedImages?.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-full h-96">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      width={600}
                      height={400}
                      style={{ objectFit: "contain" }}
                      className="rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <ChevronLeftIcon className="w-8 h-8  rounded-full p-1" />
            </div>
            <div className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <ChevronRightIcon className="w-8 h-8 rounded-full p-1" />
            </div>
          </div>
        </div>
      )}

      {showMiniserviceModal && miniservice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-lg p-6 w-1/2">
            <button
              onClick={() => setShowMiniserviceModal(false)}
              className="absolute top-2 right-2 text-gray-900 hover:text-red-900"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <h3 className="text-lg font-bold">{miniservice.title}</h3>
            <p className="mt-2">{miniservice.description}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
        <p>
          {data?.data?.length} items on page {data?.currentPage} of{" "}
          {data?.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <ArrowLeftIcon
            onClick={() => page > 1 && setPage(page - 1)}
            className="w-5 h-5 cursor-pointer"
          />
          <p>
            {data?.currentPage} / {data?.totalPages}
          </p>
          <ArrowRightIcon
            onClick={() => data?.data?.length === 10 && setPage(page + 1)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
