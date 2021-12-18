import { RenderLeafProps } from "slate-react";

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  addition?: number; // percentage approval 0-100
  deletion?: number; // percentage approval 0-100
  codeified?: string; // hash of codeification
};

export type Format = keyof Omit<CustomText, "text">;

export const HOTKEYS: { [keys: string]: Format } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

export const SlateLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  let style = {};
  if (leaf.codeified) {
    style = {
      textDecorationLine: "underline",
      textDecorationStyle: "wavy",
      textDecorationColor: "rgba(255,153,1, .5)"
    };
  }

  if (leaf.addition) {
    style = { backgroundColor: `rgba(51, 255, 51, ${leaf.addition / 100})` };
  }

  if (leaf.deletion) {
    style = {
      backgroundColor: `rgba(255, 51, 51, ${leaf.deletion / 100})`,
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
      textDecorationColor: "rgba(0, 0, 0, .5)"
    };
  }

  return (
    <span style={style} {...attributes}>
      {/* <span onFocus={} onBlur={} onMouseEnter={} onMouseLeave={} onMouseOut={}> */}
      {children}
      {/* </span> */}
    </span>
  );
};
