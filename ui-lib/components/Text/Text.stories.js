import React from "react";

import Text from "@ui/components/Text";

export default {
  title: "Typography/Text",
  component: Text,
  argTypes: {
    type: {
      options: [
        undefined,
        "h1",
        "h2",
        "h3",
        "highlight",
        "emphasis",
        "body",
        "cta",
        "link",
        "tiny",
        "subTitle",
        "navigation",
        "tag",
      ],
      control: { type: "radio" },
    },
    ff: {
      options: [
        undefined,
        "Alpha|Medium",
        "Inter|ExtraLight",
        "Inter|Light",
        "Inter|Regular",
        "Inter|Medium",
        "Inter|SemiBold",
        "Inter|Bold",
        "Inter|ExtraBold",
      ],
      control: { type: "radio" },
    },
    fontSize: { options: [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8], control: { type: "radio" } },
    content: { type: "text" },
    bracket: { type: "boolean" },
  },
};

const Template = args => <Text {...args}>{args.content}</Text>;
export const Default = Template.bind({});
Default.args = {
  type: "h1",
  content: "Lend stablecoins to the Compound protocol...",
};
