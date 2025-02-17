// import { findChildren } from '@tiptap/core';
// import { Node as ProsemirrorNode } from '@tiptap/pm/model';
// import { Plugin, PluginKey } from '@tiptap/pm/state';
// import { Decoration, DecorationSet } from '@tiptap/pm/view';
// import { createLowlight } from 'lowlight'; // Import createLowlight correctly

// const lowlight = createLowlight(); // Create an instance of lowlight

// function parseNodes(nodes, className = []) {
//   return nodes.map(node => {
//     const classes = [...className, ...(node.properties ? node.properties.className : [])];

//     if (node.children) {
//       return parseNodes(node.children, classes);
//     }

//     return {
//       text: node.value,
//       classes,
//     };
//   }).flat();
// }

// function getHighlightNodes(result) {
//   return result.value || result.children || [];
// }

// function registered(aliasOrLanguage) {
//   return Boolean(lowlight.getLanguage(aliasOrLanguage));
// }

// function getDecorations({
//   doc,
//   name,
//   lowlight,
//   defaultLanguage,
// }) {
//   const decorations = [];

//   findChildren(doc, node => node.type.name === name).forEach(block => {
//     let from = block.pos + 1;
//     const language = block.node.attrs.language || defaultLanguage;
//     const languages = lowlight.listLanguages();

//     const nodes = language && (languages.includes(language) || registered(language) || lowlight.registered?.(language))
//       ? getHighlightNodes(lowlight.highlight(language, block.node.textContent))
//       : getHighlightNodes(lowlight.highlightAuto(block.node.textContent));

//     parseNodes(nodes).forEach(node => {
//       const to = from + node.text.length;

//       if (node.classes.length) {
//         const decoration = Decoration.inline(from, to, {
//           class: node.classes.join(' '),
//         });

//         decorations.push(decoration);
//       }

//       from = to;
//     });
//   });

//   return DecorationSet.create(doc, decorations);
// }

// export function LowlightPlugin({
//   name,
//   defaultLanguage,
// }) {
//   const lowlightPlugin = new Plugin({
//     key: new PluginKey('lowlight'),

//     state: {
//       init: (_, { doc }) => getDecorations({
//         doc,
//         name,
//         lowlight,
//         defaultLanguage,
//       }),
//       apply: (transaction, decorationSet, oldState, newState) => {
//         const oldNodeName = oldState.selection.$head.parent.type.name;
//         const newNodeName = newState.selection.$head.parent.type.name;
//         const oldNodes = findChildren(oldState.doc, node => node.type.name === name);
//         const newNodes = findChildren(newState.doc, node => node.type.name === name);

//         if (
//           transaction.docChanged &&
//           ([oldNodeName, newNodeName].includes(name)
//           || newNodes.length !== oldNodes.length
//           || transaction.steps.some(step => {
//             return (
//               step.from !== undefined &&
//               step.to !== undefined &&
//               oldNodes.some(node => {
//                 return (
//                   node.pos >= step.from &&
//                   node.pos + node.node.nodeSize <= step.to
//                 );
//               })
//             );
//           }))
//         ) {
//           return getDecorations({
//             doc: transaction.doc,
//             name,
//             lowlight,
//             defaultLanguage,
//           });
//         }

//         return decorationSet.map(transaction.mapping, transaction.doc);
//       },
//     },

//     props: {
//       decorations(state) {
//         return lowlightPlugin.getState(state);
//       },
//     },
//   });

//   return lowlightPlugin;
// }

// // Export the LowlightPlugin and any other extensions here
// export const extensions = [LowlightPlugin];

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import hljs from "highlight.js/lib/core"; // Import highlight.js core
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

// Register languages with highlight.js
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", js);
hljs.registerLanguage("typescript", ts);

// Exporting extensions for use in the editor
export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  CodeBlockLowlight.configure({
    lowlight: hljs, // Use Highlight.js directly here
  }),
  Dropcursor,
  Image,
];
