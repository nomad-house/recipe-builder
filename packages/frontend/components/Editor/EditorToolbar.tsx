import { FC, ReactNode, useEffect, useState } from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { styled, Theme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeTwoToneIcon from "@mui/icons-material/CodeTwoTone";
import LooksOneTwoToneIcon from "@mui/icons-material/LooksOneTwoTone";
import LooksTwoTwoToneIcon from "@mui/icons-material/LooksTwoTwoTone";
import FormatQuoteTwoToneIcon from "@mui/icons-material/FormatQuoteTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import FormatListNumberedTwoToneIcon from "@mui/icons-material/FormatListNumberedTwoTone";

import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";
import { Format } from "./SlateLeaf";
import { Block } from "./SlateElement";

interface BlockButtonProps {
  block: Block;
}
const BlockButton: FC<BlockButtonProps> = ({ block, children }) => {
  const editor = useSlate();
  return (
    <ToggleButton
      value={block}
      selected={isBlockActive(editor, block)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, block);
      }}
    >
      {children}
    </ToggleButton>
  );
};

interface MarkButtonProps {
  format: Format;
}
const MarkButton: FC<MarkButtonProps> = ({ format, children }) => {
  const editor = useSlate();
  return (
    <ToggleButton
      value={format}
      selected={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </ToggleButton>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  border: `2px solid ${theme.palette.divider}`,
  flexWrap: "wrap"
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  alignSelf: "stretch",
  height: "auto",
  margin: theme.spacing(1, 0.5)
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  margin: theme.spacing(0.5),
  border: "none",
  padding: theme.spacing(0, 1.5),
  "&:not(:first-of-type)": {
    borderRadius: theme.shape.borderRadius
  },
  "&:first-of-type": {
    borderRadius: theme.shape.borderRadius
  }
}));

export const EditorToolbar = () => {
  return (
    <StyledPaper elevation={2}>
      <StyledToggleButtonGroup size="small" arial-label="text formatting">
        <MarkButton format="bold">
          <FormatBoldIcon />
        </MarkButton>
        <MarkButton format="italic">
          <FormatItalicIcon />
        </MarkButton>
        <MarkButton format="underline">
          <FormatUnderlinedIcon />
        </MarkButton>
        <MarkButton format="code">
          <CodeTwoToneIcon />
        </MarkButton>
      </StyledToggleButtonGroup>
      <StyledDivider orientation="vertical" />
      <StyledToggleButtonGroup size="small" arial-label="text formatting" exclusive>
        <BlockButton block="heading-one">
          <LooksOneTwoToneIcon />
        </BlockButton>
        <BlockButton block="heading-two">
          <LooksTwoTwoToneIcon />
        </BlockButton>
        <BlockButton block="block-quote">
          <FormatQuoteTwoToneIcon />
        </BlockButton>
        <BlockButton block="unordered-list">
          <FormatListBulletedTwoToneIcon />
        </BlockButton>
        <BlockButton block="ordered-list">
          <FormatListNumberedTwoToneIcon />
        </BlockButton>
      </StyledToggleButtonGroup>
    </StyledPaper>
  );
};

// export const HoveringToolbar = () => {
//   const editor = useSlate();
//   const [showToolbar, setShowToolbar] = useState(false);
//   const { selection } = editor;
//   useEffect(() => {
//     if (!selection || Editor.string(editor, selection) === "") {
//       setShowToolbar(false);
//     } else {
//       setShowToolbar(true);
//     }
//   }, [selection]);

//   return (
//     <div hidden={!showToolbar}>
//       <EditorToolbar />
//     </div>
//   );
// };
