import { Meta, Story } from "@storybook/react";
import { transactions } from "../__fixtures__";
import { TransactionList, TransactionListProps } from "./TransactionList";

const meta: Meta = {
  title: "TransactionList",
  component: TransactionList,
  argTypes: {
    transactions: {}
  }
};
export default meta;

const Template: Story<TransactionListProps> = (args) => (
  <div style={{ maxWidth: "24rem", maxHeight: "20rem", height: "20rem" }}>
    <TransactionList {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  transactions
};
