import { BaseEditor, Editor, Element, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { Block, LIST_TYPES } from "./SlateElement";
import type { Format } from "./SlateLeaf";

export const isBlockActive = (editor: BaseEditor & ReactEditor, format: Block) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === format
  });

  return !!match;
};

export const toggleBlock = (editor: BaseEditor & ReactEditor, format: Block) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && LIST_TYPES.includes(n.type),
    split: true
  });
  const newProperties: Partial<Element> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  };
  Transforms.setNodes<Element>(editor, newProperties);

  if (!isActive && isList) {
    const block: any = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const isMarkActive = (editor: BaseEditor & ReactEditor, format: Format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: BaseEditor & ReactEditor, format: Format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
