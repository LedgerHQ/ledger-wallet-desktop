import React from "react";

import Button from "./index";

import AccountAdd from "../../icons/AccountAdd";

export default {
  title: "Buttons/Button",
  component: Button,
  argTypes: {
    type: {
      options: [undefined, "primary", "secondary"],
      control: { type: "radio" },
    },
    fontSize: { options: [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8], control: { type: "radio" } },
    children: { type: "text" },
    iconPosition: { options: ["right", "left"], control: { type: "radio" } },
    disabled: { type: "boolean" },
  },
};

const Template = args => <Button {...args}>{args.children}</Button>;
export const Default = Template.bind({});
Default.args = {
  children: "Label",
};

export const IconButton = Template.bind({});
IconButton.args = {
  children: "",
  Icon: AccountAdd,
  iconPosition: "right",
};
