import { EditorContent, useEditor } from "@tiptap/react";
import "highlight.js/styles/atom-one-dark.css";
import MenuBar from "./MenuBar";
import React from "react";
import { extensions } from "../../constants/tiptapExtensions";

const Editor = ({ onDataChange, content, editable }) => {
  const editor = useEditor({
    editable,
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "!prose !dark:prose-invert prose-sm sm:prose-base max-w-none mt-7 focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onDataChange(json);
    },
    content: content,
  });

  return (
    <div className="w-full relative">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;

// import { EditorContent, useEditor } from "@tiptap/react";
// import "highlight.js/styles/atom-one-dark.css";
// import MenuBar from "./MenuBar";
// import React from "react";
// import PropTypes from 'prop-types'; // For prop type validation
// import { extensions } from "../../constants/tiptapExtensions";

// const Editor = ({ onDataChange = () => {}, content, editable }) => {
//   const editor = useEditor({
//     editable,
//     extensions: extensions,
//     editorProps: {
//       attributes: {
//         class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none m-5 focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       const json = editor.getJSON();
//       onDataChange(json); // This should now work if a function is passed
//     },
//     content: content,
//   });

//   return (
//     <div className="w-full relative">
//       {editable && <MenuBar editor={editor} />}
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// Editor.propTypes = {
//   onDataChange: PropTypes.func,
//   content: PropTypes.string,
//   editable: PropTypes.bool,
// };

// export default Editor;
