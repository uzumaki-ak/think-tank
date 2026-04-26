import React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

const MultiSelectTagDropdown = ({
  defaultValue = [],
  loadOptions,
  onChange,
}) => {
  return (
    <AsyncCreatableSelect
      defaultValue={defaultValue}
      defaultOptions
      isMulti
      loadOptions={loadOptions}
      className="relative z-20 text-xs font-ibm uppercase tracking-widest"
      classNamePrefix="select"
      onChange={onChange}
      placeholder="Select or Create..."
    />
  );
};

export default MultiSelectTagDropdown;
