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
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

function TextEditor({ index }) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    import("@mantine/core/styles.css");
  }, []);
  const dispatch = useDispatch();

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
        placeholder: "Please enter text",
      }),
    ],
    onCreate: ({ editor }) => {
      setIsFocused(false);

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
    },
  });

  return (
    <>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={60}
          className={isFocused ? "" : "hidden"}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
            <RichTextEditor.AlignJustify />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Highlight />
              <RichTextEditor.Link />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}

        {editor && (
          <FloatingMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.BulletList />
            </RichTextEditor.ControlsGroup>
          </FloatingMenu>
        )}

        <RichTextEditor.Content className="prose dark:prose-invert" />
      </RichTextEditor>
    </>
  );
}

export default TextEditor;
