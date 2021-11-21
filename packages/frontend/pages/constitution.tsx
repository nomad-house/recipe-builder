import type { NextPage } from "next";
import { useState } from "react";
import { Descendant } from "slate";
import Editor from "../components/Editor";

const Constitution: NextPage = () => {
  const initialValue: CustomElement[] = [];
  const [content, setContent] = useState<Descendant[]>(initialValue);
  return (
    <section>
      <Editor content={content} setContent={setContent} />
    </section>
  );
};

export default Constitution;
