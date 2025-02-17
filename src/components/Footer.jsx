import React from "react";
import { images } from "../constants";
import {
  AiFillFacebook,
  AiFillHeart,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";

const Footer = () => {
  return (
    <section className="bg-dark-hard ">
      <footer className="container mx-auto grid grid-cols-10 px-5 py-10 gap-y-10 gap-x-5 md:pt-20 md:grid-cols-12 lg:grid-cols-10 lg:gap-x-10 ">
        <div className=" col-span-5 md:col-span-4 lg:col-span-2  ">
          <h3 className="text-dark-light font-bold md:text-lg">Products</h3>
          <ul className="text-[#959Ead] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Landing Page</a>
            </li>
            <li>
              <a href="/">Features</a>
            </li>
            <li>
              <a href="/">Documentatiom</a>
            </li>
            <li>
              <a href="/">Referral Program</a>
            </li>
            <li>
              <a href="/">Pricing</a>
            </li>
          </ul>
        </div>
        <div className=" col-span-5 md:col-span-4 lg:col-span-2 ">
          <h3 className="text-dark-light font-bold md:text-lg">Services</h3>
          <ul className="text-[#959Ead] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Landing Page</a>
            </li>
            <li>
              <a href="/">Features</a>
            </li>
            <li>
              <a href="/">Documentatiom</a>
            </li>
            <li>
              <a href="/">Referral Program</a>
            </li>
            <li>
              <a href="/">Pricing</a>
            </li>
          </ul>
        </div>
        <div className=" col-span-5 md:col-span-4 md:col-start-5 lg:col-span-2 lg:col-start-auto">
          <h3 className="text-dark-light font-bold md:text-lg">Company</h3>
          <ul className="text-[#959Ead] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Landing Page</a>
            </li>
            <li>
              <a href="/">Features</a>
            </li>
            <li>
              <a href="/">Documentatiom</a>
            </li>
            <li>
              <a href="/">Referral Program</a>
            </li>
            <li>
              <a href="/">Pricing</a>
            </li>
          </ul>
        </div>
        <div className=" col-span-5 md:col-span-4 lg:col-span-2 ">
          <h3 className="text-dark-light font-bold md:text-lg">More</h3>
          <ul className="text-[#959Ead] text-sm mt-5 space-y-4 md:text-base">
            <li>
              <a href="/">Landing Page</a>
            </li>
            <li>
              <a href="/">Features</a>
            </li>
            <li>
              <a href="/">Documentatiom</a>
            </li>
            <li>
              <a href="/">Referral Program</a>
            </li>
            <li>
              <a href="/">Pricing</a>
            </li>
          </ul>
        </div>
        <div className="col-span-10 md:order-first md:col-span-4 lg:col-span-2 ">
          <img src={images.logo} alt="logo" className="w-10 h-10 mx-auto md:mx-0 " />
          <p className="text-sm text-dark-light text-center mt-4 md:text-left md:text-base lg:text-sm">Build a modern and creative website with Aka AK</p>
          <ul className="flex justify-center items-center mt-5  space-x-4 text-gray-300 md:justify-start">
            <li>
              <a href="/">
                <AiFillTwitterCircle className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillYoutube className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillInstagram className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillFacebook className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="/">
                <AiFillLinkedin className="w-6 h-auto" />
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-center space-y-4 md:col-span-12 lg:col-span-10">
          <div className="bg-primary text-white p-3 rounded-full">
            <AiFillHeart className="w-7 h-auto" />
          </div>
          <p className="font-bold italic text-dark-light ">Copyrigt © 2024, made with hatred</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
