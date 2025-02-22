import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula"; // Dark mode theme
import { EditorView } from "@codemirror/view";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";

function CodeEditor({ index }) {
  const dispatch = useDispatch();

  const oldCode = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data?.code
  );
  const oldLanguage = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data?.language
  );

  useEffect(() => {
    import("highlight.js/styles/github.css"); // Highlight.js theme
    import("@mantine/core/styles.css");
    import("@mantine/core/styles.layer.css");
    dispatch(
      setContent({
        index: index,
        type: "code",
        data: {
          code: code,
          language: language,
        },
      })
    );
  }, [index]);

  const [code, setCode] = useState(oldCode);
  const [language, setLanguage] = useState(oldLanguage);

  const languageExtensions = {
    javascript,
    python,
    java,
    cpp,
    html,
    css,
    json,
  };

  return (
    <div className="">
      <div className="rounded-sm  bg-gray-700">
        <div className="flex justify-end items-center mb-2">
          <select
            className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-600"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              dispatch(
                setContent({
                  index: index,
                  type: "code",
                  data: {
                    code: code,
                    language: e.target.value,
                  },
                })
              );
            }}
          >
            {Object.keys(languageExtensions).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <CodeMirror
            className="rounded border-gray-600 border-2" // Removed "overflow-hidden"
            placeholder={"Write your code here..."}
            value={code}
            theme={dracula}
            extensions={[
              EditorView.lineWrapping, // <-- Enables line wrapping
              languageExtensions[language]
                ? languageExtensions[language]()
                : javascript(),
            ]}
            height="auto"
            width="auto"
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: false,
            }}
            onBlur={(e) => {
              dispatch(
                setContent({
                  index: index,
                  type: "code",
                  data: {
                    code: code,
                    language: language,
                  },
                })
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
