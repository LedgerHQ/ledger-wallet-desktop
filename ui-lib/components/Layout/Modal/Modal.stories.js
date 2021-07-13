import React from "react";

import Modal from "./index";

export default {
  title: "Layout/Modal",
  component: Modal,
  argTypes: {},
};

const Template = args => <Modal {...args}>{args.children}</Modal>;
export const Default = Template.bind({});
Default.args = {
  children: "Label",
};
