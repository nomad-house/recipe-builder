import type { NextPage } from "next";
import { useState } from "react";
import { Descendant } from "slate";
import Editor from "../components/Editor";

const Constitution: NextPage = () => {
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " " },
        { text: "text,", deletion: 30 },
        { text: " " },
        { text: "much", italic: true },
        { text: " better than a ", addition: 50 },
        { text: "<textarea>", code: true },
        { text: "!" }
      ]
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text "
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:"
        }
      ]
    },
    {
      type: "block-quote",
      children: [{ text: "A wise quote." }]
    },
    {
      type: "paragraph",
      children: [{ text: "Try it out for yourself!" }]
    }
  ];

  const [content, setContent] = useState<Descendant[]>(initialValue);

  return (
    <section>
      <Editor content={content} setContent={setContent} />
    </section>
  );
};

export default Constitution;
