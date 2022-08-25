import { Meta, Story } from "@storybook/react";
import { EventList, EventListProps } from "./EventList";
import { events } from "../__fixtures__";

const meta: Meta = {
  title: "EventList",
  component: EventList
};
export default meta;

const Template: Story<EventListProps> = (args) => (
  <div style={{ maxWidth: "24rem", maxHeight: "20rem", height: "20rem" }}>
    <EventList {...args} />
  </div>
);
export const Default = Template.bind({});
Default.args = {
  events
};
