import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { setContent } from "../../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Code2, ChevronDown, Copy, Check } from "lucide-react";

function CodeEditor({ index }) {
  const dispatch = useDispatch();

  const oldCode = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data?.code
  );
  const oldLanguage = useSelector(
    (state) => state?.blog?.blog?.content[index]?.data?.language
  );

  const [code, setCode] = useState(oldCode || "");
  const [language, setLanguage] = useState(oldLanguage || "javascript");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    import("highlight.js/styles/github.css");
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

  const languageExtensions = {
    javascript,
    python,
    java,
    cpp,
    html,
    css,
    json,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: "🟨",
      python: "🐍",
      java: "☕",
      cpp: "⚡",
      html: "🌐",
      css: "🎨",
      json: "📋",
    };
    return icons[lang] || "💻";
  };

  return (
    <div className="space-y-1 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
      {/* Header with glass morphism */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300">
        {/* Title and controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Code Editor
            </h3>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-sm font-medium">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>

        {/* Language selector */}
        <div className="relative group mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Programming Language
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg z-10">
              {getLanguageIcon(language)}
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 
                         bg-white/60 backdrop-blur-sm 
                         border border-gray-200 rounded-xl 
                         shadow-md hover:shadow-lg 
                         focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500
                         hover:border-purple-300 hover:bg-white/80
                         transition-all duration-300 ease-in-out
                         text-gray-700 font-medium
                         appearance-none cursor-pointer
                         hover:scale-[1.02] active:scale-[0.98]"
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
                <option key={lang} value={lang} className="py-2">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-purple-600 transition-colors duration-200">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Code editor with enhanced styling */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-300 group">
        {/* Editor header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium ml-4">
              {language}.
              {language === "cpp" ? "cpp" : language === "python" ? "py" : "js"}
            </span>
          </div>
        </div>

        {/* Editor content */}
        <div className="relative">
          <CodeMirror
            className="text-editor-enhanced"
            placeholder="Write your code here... "
            value={code}
            theme={dracula}
            extensions={[
              EditorView.lineWrapping,
              languageExtensions[language]
                ? languageExtensions[language]()
                : javascript(),
            ]}
            height="auto"
            minHeight="200px"
            width="100%"
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              searchKeymap: true,
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

          {/* Subtle gradient overlay for focus effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-2xl"></div>
        </div>

        {/* Status bar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Ready</span>
              </span>
              <span>Lines: {code.split("\n").length}</span>
              <span>Characters: {code.length}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-editor-enhanced .cm-editor {
          font-family: "Fira Code", "Monaco", "Cascadia Code", monospace !important;
          font-size: 14px;
          line-height: 1.6;
        }
        .text-editor-enhanced .cm-focused {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

export default CodeEditor;
