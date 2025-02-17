import React from "react";
import { images } from "../../../constants";
import Search from "../../../components/Search";
import { useSearchParams } from "react-router-dom";
const Hero = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleSearch = ({ SearchKeyboard }) => {
    setSearchParams({ page: 1, search: SearchKeyboard });
  };


  return (
    <section className="container  flex flex-col px-5 py-5 lg:flex-row">
      <div className="mt-10 lg:w-1/2">
        <h1 className="font-rob text-3xl text-center font-bold  text-dark-soft md:text-5xl lg:text-4xl xl:text-5xl lg:text-left lg:max-w-[540px]">
          Read The Most Interesting Articles
        </h1>
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left ">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
          molestiae architecto ab reprehenderit numquam aspernatur!lorem30
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam sint, quo hic vitae exercitationem temporibus aut officiis at repellendus ullam facere pariatur ab, voluptas maxime vero suscipit cum placeat minima?
        </p>
        <Search className=" mt-10 lg:mt-6 xl:mt-10"
       onSearchKeyboard={handleSearch}
       />

        <div className="flex mt-4  flex-col lg:flex-row lg:items-start lg:flex-nowrap lg:gap-x-4 lg:mt-7">
          <span className="text-dark-light font-semibold italic mt-2 lg:mt-4  lg:text-sm xl:text-base">
            Popular Tags:
          </span>
          <ul className="flex flex-wrap gap-x-2.5 gap-y-2.5 mt-3 lg:text-sm xl:text-base ">
            <li className="rounded-lg bg-primary bg-opacity-10 px-2 py-1.5 text-primary font-semibold">
              Design
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-2 py-1.5 text-primary font-semibold">
              User Experience
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-2 py-1.5 text-primary font-semibold">
              User Interfaces
            </li>
          </ul>
        </div>
      </div>
      {/* rightimage  */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          className="  mt-12 w-full "
          src={images.HeroImage3}
          alt="users are reading articles"
        />
      </div>
    </section>
  );
};

export default Hero;