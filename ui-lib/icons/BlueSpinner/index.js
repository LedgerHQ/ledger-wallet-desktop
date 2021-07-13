// @flow

import React from "react";
import png from "./spinner.png";
import Image from "~/renderer/components/Image";

type Props = {
  size?: number,
};

function BlueSpinner({ size = 16 }: Props) {
  const defaultedSize = size || 16;
  return <Image style={{ width: defaultedSize, height: defaultedSize }} resource={png} alt="" />;
}

export default BlueSpinner;
