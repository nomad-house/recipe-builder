import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import type { CustomElement } from "./SlateElement";
import type { CustomText } from "./SlateLeaf";
import Editor from "./Editor";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export default Editor;
