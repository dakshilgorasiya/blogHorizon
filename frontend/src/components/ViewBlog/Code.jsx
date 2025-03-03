import { useEffect } from "react";
import { CodeHighlight } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Code({ data }) {
  useEffect(() => {
    import("highlight.js/styles/github.css"); // Highlight.js theme
    import("@mantine/core/styles.css");
    import("@mantine/core/styles.layer.css");
  }, []);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <div className="bg-neutral-800 rounded-lg flex flex-col">
        <Tooltip
          title="Copy"
          className="self-end"
          placement="left"
          arrow
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <IconButton onClick={() => navigator.clipboard.writeText(data.code)}>
            <ContentCopyTwoToneIcon className="text-white" />
          </IconButton>
        </Tooltip>

        <div className="bg-neutral-800 text-white px-6 rounded-lg pb-5">
          <CodeHighlight
            code={data.code}
            language={data.language}
            withCopyButton={false}
          />
        </div>
      </div>
    </MantineProvider>
  );
}

export default Code;
