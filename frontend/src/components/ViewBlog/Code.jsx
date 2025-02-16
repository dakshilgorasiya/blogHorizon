import { useEffect } from "react";
import { CodeHighlight } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import { motion } from "framer-motion";
import { Copy, CopyCheck } from "lucide-react";

function Code({ data }) {
  useEffect(() => {
    import("highlight.js/styles/github.css"); // Highlight.js theme
    import("@mantine/core/styles.css");
    import("@mantine/core/styles.layer.css");
  }, []);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <div className="relative bg-neutral-800 text-white p-4 rounded-lg">
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-5 right-2 bg-white text-black px-2 py-1 rounded-md shadow-md"
        >
          <Copy size={20} />
        </button>

        <CodeHighlight
          code={data.code}
          language={data.language}
          withCopyButton={false}
        />
      </div>
    </MantineProvider>
  );
}

export default Code;
