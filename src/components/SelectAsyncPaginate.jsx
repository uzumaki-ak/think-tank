import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const AsyncMultiSelectTagDropdown = ({
  defaultValue = [],
  loadOptions,
  onChange,
  placeholder,
}) => {
  const isDarkMode = document.documentElement.classList.contains("dark");

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      fontFamily: "IBM Plex Mono",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#0A0A0A" : "#F5F5F0",
      border: "1px solid rgba(128,128,128,0.2)",
      borderRadius: "0px",
      boxShadow: "none",
      padding: "0px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused 
        ? (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") 
        : "transparent",
      color: isDarkMode ? "#F2F2F2" : "#050505",
      fontFamily: "IBM Plex Mono",
      fontSize: "10px",
      padding: "12px 20px",
      cursor: "pointer",
      textTransform: "uppercase",
      "&:active": {
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      borderRadius: "0px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDarkMode ? "#F2F2F2" : "#050505",
      fontSize: "9px",
      padding: "2px 8px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDarkMode ? "#F2F2F2" : "#050505",
      opacity: 0.5,
      "&:hover": {
        backgroundColor: "transparent",
        opacity: 1,
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(128,128,128,0.5)",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? "#F2F2F2" : "#050505",
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? "#F2F2F2" : "#050505",
    })
  };

  return (
    <AsyncPaginate
      defaultValue={defaultValue}
      placeholder={placeholder}
      defaultOptions
      isMulti
      loadOptions={loadOptions}
      styles={customStyles}
      className="relative z-20"
      onChange={onChange}
      additional={{
        page: 1,
      }}
    />
  );
};

export default AsyncMultiSelectTagDropdown;

