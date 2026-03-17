import { useCallback } from "react";
import {
  AiOutlineBold,
  AiOutlineClose,
  AiOutlineEnter,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineLink,
  AiOutlineRedo,
  AiOutlineStrikethrough,
  AiOutlineUndo,
  AiOutlineUnorderedList,
  AiOutlineUnderline,
} from "react-icons/ai";
import { BiParagraph } from "react-icons/bi";
import { FiCode } from "react-icons/fi";
import { MdOutlineLayersClear } from "react-icons/md";
import { PiCodeBlock, PiQuotes, PiImageSquareBold } from "react-icons/pi";
import { TbSpacingVertical } from "react-icons/tb";


const MenuBar = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-300 rounded-lg p-5 sticky top-3 left-0 right-0 bg-white dark:bg-[#111111] dark:border-[#2a2a2a] z-10 flex gap-0.5 flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`flex justify-center items-center text-slate-700 rounded-lg aspect-square w-8 font-black ${
          editor.isActive("heading", { level: 1 }) && "active-editor-btn"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-extrabold ${
          editor.isActive("heading", { level: 2 }) && "active-editor-btn"
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-semibold ${
          editor.isActive("heading", { level: 3 }) && "active-editor-btn"
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-medium ${
          editor.isActive("heading", { level: 4 }) && "active-editor-btn"
        }`}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-normal ${
          editor.isActive("heading", { level: 5 }) && "active-editor-btn"
        }`}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-normal ${
          editor.isActive("heading", { level: 6 }) && "active-editor-btn"
        }`}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("bold") && "active-editor-btn"
        }`}
      >
        <AiOutlineBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("italic") && "active-editor-btn"
        }`}
      >
        <AiOutlineItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("underline") && "active-editor-btn"
        }`}
      >
        <AiOutlineUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("strike") && "active-editor-btn"
        }`}
      >
        <AiOutlineStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("code") && "active-editor-btn"
        }`}
      >
        <FiCode />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <MdOutlineLayersClear />
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <AiOutlineClose />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("paragraph") && "active-editor-btn"
        }`}
      >
        <BiParagraph />
      </button>

      <button onClick={addImage} className="flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square font-extrabold"><PiImageSquareBold /></button>
      <button
        onClick={setLink}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("link") && "active-editor-btn"
        }`}
      >
        <AiOutlineLink />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square"
        title="Reset color"
      >
        <span className="text-xs font-semibold">A</span>
      </button>
      <input
        type="color"
        className="h-8 w-8 cursor-pointer rounded-lg border border-slate-300 bg-transparent dark:border-[#2a2a2a]"
        onChange={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        title="Text color"
      />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("bulletList") && "active-editor-btn"
        }`}
      >
        <AiOutlineUnorderedList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("orderedList") && "active-editor-btn"
        }`}
      >
        <AiOutlineOrderedList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("codeBlock") && "active-editor-btn"
        }`}
      >
        <PiCodeBlock />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square ${
          editor.isActive("blockquote") && "active-editor-btn"
        }`}
      >
        <PiQuotes />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <TbSpacingVertical />
      </button>
      <button
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <AiOutlineEnter />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <AiOutlineUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={`flex justify-center w-8 items-center text-slate-700 rounded-lg aspect-square`}
      >
        <AiOutlineRedo />
      </button>

    </div>
  );
};

export default MenuBar;
