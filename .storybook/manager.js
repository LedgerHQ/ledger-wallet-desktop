import { addons } from "@storybook/addons";
import ledgerTheme from "./ledgerTheme";

addons.setConfig({
  panelPosition: "right",
  enableShortcuts: true,
  isToolshown: true,
  theme: ledgerTheme,
});
