import React from "react";

import Modal from "./index";
import theme from "@ui/styles/theme";
import { useArgs } from "@storybook/client-api";

export default {
  title: "Layout/Modal",
  component: Modal,
  argTypes: {
    children: {
      type: "text",
      description: "Any valid React node",
      required: true,
      control: { type: "text" },
    },
    width: {
      type: "number",
      description: "Optional modal's width",
      default: theme.sizes.modal.min.width,
      control: {
        type: "number",
        min: theme.sizes.modal.min.width,
        max: theme.sizes.modal.max.width,
      },
      table: {
        type: {
          summary: "Accepted range",
          detail: `Value lower than ${theme.sizes.modal.min.width}px or greather than ${theme.sizes.modal.max.width}px will have no effect because of min/max css rules.`,
        },
        defaultValue: { summary: theme.sizes.modal.min.width },
      },
    },
    height: {
      type: "number",
      description: "Optional modal's height",
      control: {
        type: "number",
        min: theme.sizes.modal.min.height,
        max: theme.sizes.modal.max.height,
      },
      table: {
        type: {
          summary: "Accepted range",
          detail: `Value lower than ${theme.sizes.modal.min.height}px or greather than ${theme.sizes.modal.max.height}px will have no effect because of min/max css rules.`,
        },
        defaultValue: { summary: theme.sizes.modal.min.height },
      },
    },
    isOpen: {
      type: "boolean",
      value: true,
      description: "Controls if the Modal is rendered.",
      required: true,
      control: { type: "boolean" },
    },
    onClose: {
      description: "Unmount modal component",
      control: false,
    },
  },
};

const Template = args => {
  const [, updateArgs] = useArgs();

  /* Allow interactive controls from the story. Thanks to this, triggering onClose
   ** function from the component itself (by clicking on the cross icon e.g.)
   ** will update the value of the isOpen props.
   */
  const onClose = () => updateArgs({ isOpen: false });

  return (
    <Modal {...args} onClose={onClose}>
      {args.children}
    </Modal>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: "I'm the content passed as a children to the Modal component",
};
