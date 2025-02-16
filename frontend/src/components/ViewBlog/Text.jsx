import DOMPurify from "dompurify";

function Text({ text }) {
  const sanitizedContent = DOMPurify.sanitize(text);
  return (
    <div
      className="text-gray-900 prose dark:text-gray-100 font-serif"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

export default Text;
