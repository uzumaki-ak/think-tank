import React from "react";
import { images } from "../../../constants";

const CTA = () => {
  return (
    <>
      <svg
        className="w-full h-auto max-h-40 translate-y-[1px]"
        preserveAspectRatio="none"
        viewBox="0 0 2160 263"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Wave"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2160 262.5H0V0C360 80 720 120 1080 120C1440 120 1800 80 2160 0V262.5Z"
          fill="#0D2436"
        />
      </svg>
      <section className="relative bg-dark-hard px-5 ">
        <div className="container grid-cols-12 mx-auto py-10 md:pb-20 lg:place-items-center">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="text-white font-rob font-bold text-2xl md:text-4xl md:text-center md:leading-normal lg:text-left">
              Get our stories delivered from us to yoir inbox weekly.
            </h2>
            <div className="w-full max-w-[494px] mt-12 space-y-3 mx-auto md:space-y-0 md:flex md:items-center md:space-x-2 lg:mx-0">
              <input
                type="text"
                placeholder="your email"
                className="px-4 py-3 rounded-lg  placeholder:to-dark-light w-full"
              />
              <button
                className="px-4 py-3 rounded-lg bg-primary w-full to-white
           font-bold md:w-fit md:whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
            <p className="text-dark-light text-sm leading-7 mt-6 md:text-center md:text-base lg:text-left ">
              <span className="font-bold italic text-[#B3BA65] md:not-italic md:font-normal md:text-dark-light">
                {" "}
                Lorem ipsum dolor sit
              </span>{" "}
              amet consectetur adipisicing elit. Eos autem vel repellendus
              consectetur assumenda laborum fugiat.
            </p>
          </div>
          <div className="col-span-12 hidden mt-[70px] md:block md:order-first lg:col-span-6 lg:order-last">
            <div className="w-3/4 mx-auto relative">
              <div className="w-1/2 h-1/2 bg-[#FC5A5A] rounded-lg absolute top-[10%] -right-[8%]" />
              <div className="w-1/2 h-1/2 bg-[#ebe9e9] rounded-lg opacity-[.06] absolute -bottom-[10%] -left-[8%]" />
              <div className="rounded-xl w-full bg-white p-3 z-[1] relative">
                <img
                  src={images.CtaImage}
                  alt="title"
                  className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
                />
                <div className="p-5">
                  <h2 className="font-rob font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">
                    Future Of Work
                  </h2>
                  <p className="text-dark-light mt-3 text-sm md:text-lg ">
                    Majority Of People Will Work In Job That Don't exist Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
