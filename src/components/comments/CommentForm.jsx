import React, { useState } from "react";

const CommentForm = ({
  btnLable,
  formSubmitHandler,
  formCancelHandler = null,
  initialText = "",
  loading = false,
}) => {
  const [value, setValue] = useState(initialText);

  const submitHandler = (e) => {
    e.preventDefault();
    formSubmitHandler(value);
    setValue("");
  };

  return (
    <form onSubmit={submitHandler} className="w-full">
      <div className="flex flex-col border-thin border-black/10 dark:border-white/10 p-6 bg-transparent transition-all focus-within:border-black/30 dark:focus-within:border-white/30">
        <textarea
          className="w-full focus:outline-none bg-transparent font-inter text-sm opacity-80 leading-relaxed placeholder:opacity-20"
          rows="4"
          placeholder="ENTER TRANSMISSION CONTENT..."
          value={value}
          onChange={(e) => e.target.value.length <= 1000 && setValue(e.target.value)}
        />
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t-thin border-black/5 dark:border-white/5">
          <div className="font-ibm text-[9px] tracking-widest uppercase opacity-20">
            Char Count: {value.length}/1000
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            {formCancelHandler && (
              <button
                type="button"
                onClick={formCancelHandler}
                className="flex-1 sm:flex-none px-8 py-3 border-thin border-red-500/30 text-red-500 font-bricolage text-[10px] tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all"
              >
                ABORT
              </button>
            )}
            <button
              disabled={loading || value.length === 0}
              type="submit"
              className="flex-1 sm:flex-none px-10 py-3 bg-matte-black text-bone dark:bg-bone dark:text-matte-black font-bricolage text-[10px] tracking-widest uppercase hover:opacity-80 disabled:opacity-20 transition-all"
            >
              {loading ? "TRANSMITTING..." : btnLable || "TRANSMIT"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;

