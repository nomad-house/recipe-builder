import { Meta, Story } from "@storybook/react";
import { ContractMeta, ContractMetaProps } from "./ContractMeta";
import { events, transactions } from "../__fixtures__";

const meta: Meta = {
  title: "ContractMeta",
  component: ContractMeta
};
export default meta;

const Template: Story<ContractMetaProps> = (args) => <ContractMeta {...args} />;

export const Default = Template.bind({});
Default.args = {
  events,
  transactions
};
