import { useEffect, useRef } from "react";

export default function Contenteditable(props) {
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (contentEditableRef.current.textContent !== props.value) {
      contentEditableRef.current.textContent = props.value;
    }
  });

  return (
    <div
      contentEditable="true"
      name="message"
      id="message"
      rows={4}
      ref={contentEditableRef}
      onInput={event => {
        props.onChange(event.target.textContent);
      }}
      className="overflow-auto break-words block w-full min-h-fit rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 whitespace-pre"
    />
  );
}
