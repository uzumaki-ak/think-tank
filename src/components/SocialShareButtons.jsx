import React from "react";
import { 
  RiTwitterXFill, 
  RiFacebookFill, 
  RiRedditFill, 
  RiWhatsappFill 
} from "react-icons/ri";

const SocialShareButtons = ({ url, title }) => {
  const shareNodes = [
    { 
      label: "X", 
      icon: <RiTwitterXFill size={16} />, 
      href: `https://twitter.com/intent/tweet?url=${url}` 
    },
    { 
      label: "REDDIT", 
      icon: <RiRedditFill size={16} />, 
      href: `https://www.reddit.com/submit?url=${url}&title=${title}` 
    },
    { 
      label: "WHATSAPP", 
      icon: <RiWhatsappFill size={16} />, 
      href: `https://api.whatsapp.com/send/?text=${url}` 
    },
    { 
      label: "FACEBOOK", 
      icon: <RiFacebookFill size={16} />, 
      href: `https://www.facebook.com/dialog/share?display=popup&href=${url}` 
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shareNodes.map((node) => (
        <a
          key={node.label}
          target="_blank"
          rel="noreferrer"
          href={node.href}
          className="flex items-center gap-3 px-4 py-2 border-thin border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
        >
          <span className="opacity-40 group-hover:opacity-100 transition-opacity">
            {node.icon}
          </span>
          <span className="font-geist text-[8px] tracking-[0.2em] uppercase opacity-30 group-hover:opacity-100 transition-opacity">
            [{node.label}]
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialShareButtons;

