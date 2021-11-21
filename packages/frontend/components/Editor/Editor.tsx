import { useMemo, FC, Dispatch, SetStateAction } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import styles from "./Editor.module.scss";

interface EditorProps {
  content: Descendant[];
  setContent: Dispatch<SetStateAction<Descendant[]>>;
}

const Editor: FC<EditorProps> = ({ content, setContent }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <section className={styles.container}>
      <Slate value={content} onChange={(newValue) => setContent(newValue)} editor={editor}>
        <Editable
          className={styles.editable}
          spellCheck={false}
          autoCorrect="false"
          autoCapitalize="false"
        />
      </Slate>
    </section>
  );
};

export default Editor;
