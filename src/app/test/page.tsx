"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ReactPlayer from "react-player";

const VideoSection = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const bgimg1 = "/video-bg.jpg"; // Replace with your actual image URL

  return (
    <div className="xl:w-1/2 lg:w-1/2 w-full">
      <div className="relative z-[1] mt-10 mb-12 mr-10">
        {/* Background Section */}
        <div
          className="relative z-[1] bg-no-repeat bg-cover bg-center overflow-hidden p-[170px_40px] flex items-center justify-center"
          style={{ backgroundImage: `url(${bgimg1})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-900 opacity-40 z-[-1]" />

          {/* Top Borders */}
          {/* <div className="absolute top-0 left-0 w-20 h-1 bg-white" />
          <div className="absolute top-0 right-0 w-20 h-1 bg-white" /> */}

          {/* "5 Years Experience" Text */}
          <div className="absolute bottom-5 left-5 text-white text-[36px] font-bold">
            5 Years <br /> Experience
          </div>

          {/* Play Button */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg text-black hover:bg-gray-200 transition-all duration-300"
          >
            <i className="fa fa-play text-xl" />
            <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
            {/* Inverted Triangle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 absolute bottom-1/3  "
            >
              <path
                fill-rule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-fit max-w-3xl bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-2 right-2 text-black bg-white p-2 rounded-full hover:text-gray-600 transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=XVzGdMmtOyw"
              width="100%"
              height="500px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
