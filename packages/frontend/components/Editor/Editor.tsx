import { useMemo, FC, Dispatch, SetStateAction, useCallback } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";

import { EditorToolbar } from "./EditorToolbar";
import { SlateElement } from "./SlateElement";
import { HOTKEYS, SlateLeaf } from "./SlateLeaf";
import { toggleMark } from "./utils";

import styles from "./Editor.module.scss";
interface EditorProps {
  content: Descendant[];
  setContent: Dispatch<SetStateAction<Descendant[]>>;
}

const Editor: FC<EditorProps> = ({ content, setContent }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);

  return (
    <section className={styles.container}>
      <Slate value={content} onChange={(newValue) => setContent(newValue)} editor={editor}>
        <EditorToolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className={styles.editable}
          spellCheck={false}
          autoCorrect="false"
          autoCapitalize="false"
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </section>
  );
};

export default Editor;
