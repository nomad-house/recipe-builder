import { Descendant } from "slate";
import { RenderElementProps } from "slate-react";
import Link from "../Link";

type LinkElement = { type: "link"; url: string; children: Descendant[] };
type ParagraphElement = { type: "paragraph"; children: Descendant[] };
type BlockQuoteElement = { type: "block-quote"; children: Descendant[] };
type HeadingOneElement = { type: "heading-one"; children: Descendant[] };
type HeadingTwoElement = { type: "heading-two"; children: Descendant[] };
type UnorderedListElement = { type: "unordered-list"; children: ListItemElement[] };
type OrderedListElement = { type: "ordered-list"; children: ListItemElement[] };
type ListItemElement = { type: "list-item"; children: Descendant[] };

export type Block =
  | LinkElement["type"]
  | ParagraphElement["type"]
  | BlockQuoteElement["type"]
  | HeadingOneElement["type"]
  | HeadingTwoElement["type"]
  | UnorderedListElement["type"]
  | OrderedListElement["type"];

export const LIST_TYPES = ["unordered-list", "ordered-list"];

export type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | UnorderedListElement
  | OrderedListElement
  | ListItemElement
  | HeadingOneElement
  | HeadingTwoElement
  | LinkElement;

export const SlateElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    // case "paragraph":
    //   return <p {...attributes}>{children}</p>;
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "unordered-list":
      return <ul {...attributes}>{children}</ul>;
    case "ordered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "link":
      return (
        <Link {...attributes} href={element.url}>
          {children}
        </Link>
      );
    default:
      return <div {...attributes}>{children}</div>;
  }
};
