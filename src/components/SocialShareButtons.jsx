import React from "react";
import {
  AiFillFacebook,
  AiFillRedditSquare,
  AiFillTwitterSquare,
} from "react-icons/ai";
import { FaSquareWhatsapp } from "react-icons/fa6";

const SocialShareButtons = ({ url, title }) => {
  return (
    <div className="w-full flex justify-between">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/dialog/share?app_id=1234567890&display=popup&href=${url}`}

        // yha pe id me apna meta se id dedio get started dev for meta pe jake
      >
        <AiFillFacebook className="text-[#3b5998] w-12 h-auto" />
      </a>
      <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?url=${url}`}>
        <AiFillTwitterSquare className="text-[#00acee] w-12 h-auto" />
      </a>
      <a target="_blank" rel="noreferrer" href={`https://www.reddit.com/submit?url=${url}&title=${title}`}>
        <AiFillRedditSquare className="text-[#ff4500] w-12 h-auto" />
      </a>
      <a target="_blank" rel="noreferrer" href={`https://api.whatsapp.com/send/?text=${url}`}>
        <FaSquareWhatsapp className="text-[#25d366] w-12 h-auto" />
      </a>
    </div>
  );
};

export default SocialShareButtons;
