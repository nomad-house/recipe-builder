import { FC, ReactNode, useEffect, useState } from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { createStyles, makeStyles, Theme, withStyles } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
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
  format: Block;
  icon: ReactNode;
}
const BlockButton: FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToggleButton
      value={format}
      selected={isBlockActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </ToggleButton>
  );
};

interface MarkButtonProps {
  format: Format;
  icon: ReactNode;
}
const MarkButton: FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToggleButton
      value={format}
      selected={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </ToggleButton>
  );
};

export const SlateToolbar = () => {
  const classes = useStyles();
  return (
    <Paper elevation={2} className={classes.paper}>
      <StyledToggleButtonGroup size="small" arial-label="text formatting">
        {MarkButton({ format: "bold", icon: <FaBold size={18} /> })}
        {MarkButton({
          format: "italic",
          icon: <FaItalic size={18} />
        })}
        {MarkButton({
          format: "underline",
          icon: <FaUnderline size={18} />
        })}
        {MarkButton({
          format: "code",
          icon: <FaCode size={20} />
        })}
      </StyledToggleButtonGroup>
      <Divider orientation="vertical" className={classes.divider} />
      <StyledToggleButtonGroup size="small" arial-label="text formatting" exclusive>
        {BlockButton({ format: "heading-one", icon: <MdLooksOne size={24} /> })}
        {BlockButton({ format: "heading-two", icon: <MdLooksTwo size={24} /> })}
        {BlockButton({
          format: "block-quote",
          icon: <MdFormatQuote size={24} />
        })}
        {BlockButton({
          format: "numbered-list",
          icon: <MdFormatListNumbered size={24} />
        })}
        {BlockButton({
          format: "bulleted-list",
          icon: <MdList size={34} />
        })}
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export const HoveringToolbar = () => {
  const editor = useSlate();
  const [showToolbar, setShowToolbar] = useState(false);
  const { selection } = editor;
  useEffect(() => {
    if (!selection || Editor.string(editor, selection) === "") {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
  }, [selection]);

  return (
    <div hidden={!showToolbar}>
      <SlateToolbar />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      border: `2px solid ${theme.palette.divider}`,
      flexWrap: "wrap"
    },
    divider: {
      alignSelf: "stretch",
      height: "auto",
      margin: theme.spacing(1, 0.5)
    },
    button: {
      border: "none",
      paddingBottom: theme.spacing(1)
    }
  })
);

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(0.5),
    border: "none",
    padding: theme.spacing(0, 1.5),
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup);
