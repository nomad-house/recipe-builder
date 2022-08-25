import Grid from "@material-ui/core/Grid";
import { Meta, Story } from "@storybook/react";
import { useState } from "react";
import { FileUpload, MockFileUploadProps, OnUpdate } from "./FileUpload";
import { FileWrapper } from "./types";

const meta: Meta = {
  title: "FileUpload",
  component: FileUpload
};
export default meta;

let index = 0;

const Template: Story<MockFileUploadProps> = (args) => {
  const onUpdate: OnUpdate = (_files) => {
    if (!index) {
      index++;
      console.log(_files[0].name);
      _files[0].delete();
    }
  };
  return (
    <Grid item>
      <FileUpload {...args} name="name" region="us-east-1" bucket="bucket" onUpdate={onUpdate} />
    </Grid>
  );
};

export const Default = Template.bind({});
Default.args = {
  mockFiles: []
};
