import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor, BubbleMenu, FloatingMenu } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Edit3, Type } from "lucide-react";

function TextEditor({ index }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useEffect(() => {
    import("@mantine/core/styles.css");
  }, []);

  const dispatch = useDispatch();

  const oldData = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your content here...",
      }),
    ],
    content: oldData,
    onCreate: ({ editor }) => {
      setIsFocused(false);
      setIsToolbarVisible(false);

      dispatch(
        setContent({
          index: index,
          type: "text",
          data: editor.getHTML(),
        })
      );
    },
    onBlur: ({ editor }) => {
      setIsFocused(false);
      setIsToolbarVisible(false);
      dispatch(
        setContent({
          index: index,
          type: "text",
          data: editor.getHTML(),
        })
      );
    },
    onFocus: ({ editor }) => {
      setIsFocused(true);
      setIsToolbarVisible(true);
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Header with gradient label */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Content Editor
          </span>
        </div>

        {/* Status indicator */}
        <div
          className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
          ${
            isFocused
              ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }
        `}
        >
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isFocused ? "bg-purple-500" : "bg-gray-400"
            }`}
          />
          {isFocused ? "Editing" : "Ready"}
        </div>
      </div>

      {/* Editor container with glass morphism */}
      <div
        className={`
        relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border transition-all duration-300 ease-in-out overflow-hidden
        ${
          isFocused
            ? "border-purple-400 shadow-xl ring-4 ring-purple-500/20 scale-[1.01]"
            : "border-gray-200 hover:border-purple-300 hover:shadow-xl"
        }
      `}
      >
        {/* Decorative gradient border effect */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 -z-10 transition-opacity duration-300
          ${isFocused ? "opacity-10" : ""}
        `}
        />

        <RichTextEditor editor={editor} className="border-none">
          {/* Custom styled toolbar */}
          <RichTextEditor.Toolbar
            sticky
            stickyOffset={0}
            className={`
              transition-all duration-300 ease-in-out border-none bg-white/90 backdrop-blur-sm !sticky !top-[0px] !z-50
              ${
                isToolbarVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }
            `}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
              borderBottom: "1px solid rgba(147, 51, 234, 0.1)",
              borderRadius: "16px 16px 0 0",
              position: "sticky",
              top: "60px",
              zIndex: 50,
            }}
          >
            {/* Formatting Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-purple-100">
              <RichTextEditor.Bold className="hover:bg-purple-50 hover:text-purple-700 transition-colors" />
              <RichTextEditor.Italic className="hover:bg-purple-50 hover:text-purple-700 transition-colors" />
              <RichTextEditor.Underline className="hover:bg-purple-50 hover:text-purple-700 transition-colors" />
              <RichTextEditor.Strikethrough className="hover:bg-purple-50 hover:text-purple-700 transition-colors" />
              <RichTextEditor.ClearFormatting className="hover:bg-red-50 hover:text-red-600 transition-colors" />
              <RichTextEditor.Highlight className="hover:bg-yellow-50 hover:text-yellow-700 transition-colors" />
            </RichTextEditor.ControlsGroup>

            {/* Heading Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-blue-100">
              <RichTextEditor.H1 className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
              <RichTextEditor.H2 className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
              <RichTextEditor.H3 className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
              <RichTextEditor.H4 className="hover:bg-blue-50 hover:text-blue-700 transition-colors" />
            </RichTextEditor.ControlsGroup>

            {/* List Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-green-100">
              <RichTextEditor.BulletList className="hover:bg-green-50 hover:text-green-700 transition-colors" />
              <RichTextEditor.OrderedList className="hover:bg-green-50 hover:text-green-700 transition-colors" />
              <RichTextEditor.Subscript className="hover:bg-green-50 hover:text-green-700 transition-colors" />
              <RichTextEditor.Superscript className="hover:bg-green-50 hover:text-green-700 transition-colors" />
            </RichTextEditor.ControlsGroup>

            {/* Link Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-indigo-100">
              <RichTextEditor.Link className="hover:bg-indigo-50 hover:text-indigo-700 transition-colors" />
              <RichTextEditor.Unlink className="hover:bg-indigo-50 hover:text-indigo-700 transition-colors" />
            </RichTextEditor.ControlsGroup>

            {/* Alignment Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-pink-100">
              <RichTextEditor.AlignLeft className="hover:bg-pink-50 hover:text-pink-700 transition-colors" />
              <RichTextEditor.AlignCenter className="hover:bg-pink-50 hover:text-pink-700 transition-colors" />
              <RichTextEditor.AlignRight className="hover:bg-pink-50 hover:text-pink-700 transition-colors" />
              <RichTextEditor.AlignJustify className="hover:bg-pink-50 hover:text-pink-700 transition-colors" />
            </RichTextEditor.ControlsGroup>

            {/* History Controls */}
            <RichTextEditor.ControlsGroup className="bg-white/60 rounded-lg border border-gray-200">
              <RichTextEditor.Undo className="hover:bg-gray-50 hover:text-gray-700 transition-colors" />
              <RichTextEditor.Redo className="hover:bg-gray-50 hover:text-gray-700 transition-colors" />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          {/* Enhanced Bubble Menu */}
          {editor && (
            <BubbleMenu editor={editor}>
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200 p-2">
                <RichTextEditor.ControlsGroup className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <RichTextEditor.Bold className="hover:bg-purple-100 hover:text-purple-700 transition-all hover:scale-110" />
                  <RichTextEditor.Italic className="hover:bg-purple-100 hover:text-purple-700 transition-all hover:scale-110" />
                  <RichTextEditor.Underline className="hover:bg-purple-100 hover:text-purple-700 transition-all hover:scale-110" />
                  <RichTextEditor.Highlight className="hover:bg-yellow-100 hover:text-yellow-700 transition-all hover:scale-110" />
                  <RichTextEditor.Link className="hover:bg-blue-100 hover:text-blue-700 transition-all hover:scale-110" />
                </RichTextEditor.ControlsGroup>
              </div>
            </BubbleMenu>
          )}

          {/* Enhanced Floating Menu */}
          {editor && (
            <FloatingMenu editor={editor}>
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200 p-2">
                <RichTextEditor.ControlsGroup className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <RichTextEditor.H1 className="hover:bg-blue-100 hover:text-blue-700 transition-all hover:scale-110" />
                  <RichTextEditor.H2 className="hover:bg-blue-100 hover:text-blue-700 transition-all hover:scale-110" />
                  <RichTextEditor.BulletList className="hover:bg-green-100 hover:text-green-700 transition-all hover:scale-110" />
                </RichTextEditor.ControlsGroup>
              </div>
            </FloatingMenu>
          )}

          {/* Content area with enhanced styling */}
          <RichTextEditor.Content
            className="prose dark:prose-invert max-w-none min-h-[300px] p-6"
            style={{
              background: "transparent",
            }}
          />
        </RichTextEditor>

        {/* Typing indicator */}
        {isFocused && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-purple-100">
            <Type className="w-3 h-3 text-purple-600 animate-pulse" />
            <span className="text-xs text-purple-600 font-medium">
              Writing...
            </span>
          </div>
        )}
      </div>

      {/* Subtle help text */}
      <p className="text-sm text-gray-500 ml-1 flex items-center gap-2">
        <span>💡</span>
        Click to start editing. Use the toolbar for formatting options, or
        select text for quick actions.
      </p>

      <style jsx>{`
        .mantine-RichTextEditor-toolbar {
          backdrop-filter: blur(12px) !important;
          position: sticky !important;
          z-index: 50 !important;
        }

        .mantine-RichTextEditor-content {
          background: transparent !important;
        }

        .mantine-RichTextEditor-content .ProseMirror {
          outline: none !important;
          padding: 1.5rem !important;
          min-height: 300px !important;
        }

        .mantine-RichTextEditor-content
          .ProseMirror
          p.is-editor-empty:first-child::before {
          color: rgb(156, 163, 175) !important;
          float: left;
          height: 0;
          pointer-events: none;
        }

        .mantine-RichTextEditor-control:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

export default TextEditor;
