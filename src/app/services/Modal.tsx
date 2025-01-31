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
  const [videoUrl, setVideoUrl] = useState(portfolioData?.videoUrl || "");
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
  const [miniServices, setMiniServices] = useState<any[]>(
    portfolioData?.miniService || [],
  ); // Load existing mini-services from portfolioData

  const [newMiniService, setNewMiniService] = useState({
    title: "",
    description: "",
  }); // Track new mini-service input

  const [isMiniServiceModalOpen, setIsMiniServiceModalOpen] = useState(false); // Control mini-service modal visibility
  const [isEditing, setIsEditing] = useState(false); // Control whether we are editing a mini-service

  const [currentMiniServiceId, setCurrentMiniServiceId] = useState<
    number | null
  >(null); // Track the id of the mini-service being edited

  const handleMiniServiceModalClose = () => {
    setIsMiniServiceModalOpen(false);
    setNewMiniService({ title: "", description: "" });
    setIsEditing(false); // Reset edit state when closing
    setCurrentMiniServiceId(null); // Reset the edit ID
  };

  const handleMiniServiceSubmit = () => {
    if (newMiniService.title && newMiniService.description) {
      if (isEditing && currentMiniServiceId !== null) {
        setMiniServices((prev) =>
          prev.map((service) =>
            service.id === currentMiniServiceId
              ? { ...service, ...newMiniService }
              : service,
          ),
        );
      } else {
        setMiniServices((prev) => [
          ...prev,
          { ...newMiniService, id: Date.now() }, // Add a unique id for each mini-service
        ]);
      }
      handleMiniServiceModalClose();
    } else {
      toast.error(
        "Please provide both title and description for the mini-service.",
      );
    }
  };

  const handleEditMiniService = (id: number) => {
    const serviceToEdit = miniServices.find((service) => service.id === id);
    if (serviceToEdit) {
      setNewMiniService({
        title: serviceToEdit.title,
        description: serviceToEdit.description,
      });
      setIsEditing(true);
      setCurrentMiniServiceId(id);
      setIsMiniServiceModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
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
      miniService: miniServices.map((service) => ({
        title: service.title,
        description: service.description,
      })),
      videoUrl,
    };

    const formData = new FormData();
    images &&
      Array.from(images).forEach((file: any) => {
        formData.append("files", file);
      });

    try {
      if (portfolioData?.title?.length > 0) {
        const res = await axiosApi.put(
          `/services/${portfolioData?._id}`,
          payload,
        );
        if (res) {
          closeModal();
          toast.success("Services updated successfully");
          setCounter((prev: number) => prev + 1);
          setPortfolioData(null);
        }
      } else {
        const res = await axiosApi.post("/services/create", payload);
        if (res) {
          closeModal();
          const res2 = await axiosApi.post(
            `/services/create/images/${res.data._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          toast.success("Services created successfully");
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

            {/* Mini-Service Section */}
            <div>
              <label htmlFor="miniServices">Mini-Services</label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsMiniServiceModalOpen(true)}
                  className="py-2 px-4 bg-black  text-white rounded-xl"
                >
                  Add Mini-Service
                </button>
                {miniServices.length > 0 && (
                  <div className="mt-2">
                    {miniServices.map((service, index) => (
                      <div key={service.id} className="flex justify-between">
                        <span>{service.title}</span>
                        <button
                          type="button"
                          onClick={() => handleEditMiniService(service.id)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <XMarkIcon
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setMiniServices((prev) =>
                              prev.filter((s) => s.id !== service.id),
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mini-Service Modal */}
            {isMiniServiceModalOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-80">
                  <h3 className="text-xl">
                    {isEditing ? "Edit Mini-Service" : "Add Mini-Service"}
                  </h3>
                  <div className="mt-4">
                    <label htmlFor="miniServiceTitle">Title</label>
                    <input
                      type="text"
                      id="miniServiceTitle"
                      value={newMiniService.title}
                      onChange={(e) =>
                        setNewMiniService({
                          ...newMiniService,
                          title: e.target.value,
                        })
                      }
                      className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="miniServiceDescription">Description</label>
                    <textarea
                      id="miniServiceDescription"
                      value={newMiniService.description}
                      onChange={(e) =>
                        setNewMiniService({
                          ...newMiniService,
                          description: e.target.value,
                        })
                      }
                      className="w-full py-2 rounded-xl outline-bgBlack bg-primaryGray text-bgBlack pl-6"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handleMiniServiceSubmit}
                      className="py-2 px-4 bg-green-500 text-white rounded-xl"
                    >
                      {isEditing ? "Update" : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={handleMiniServiceModalClose}
                      className="py-2 px-4 bg-gray-500 text-white rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload Section */}
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
                    Click to upload your Portfolio Images
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
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-between mt-4">
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleSubmit(e)
                }
                className="w-full py-2 rounded-xl outline-bgBlack bg-black text-white"
              >
                {portfolioData?.title?.length > 0 ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
