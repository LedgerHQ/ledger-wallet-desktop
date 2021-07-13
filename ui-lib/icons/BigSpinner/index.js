// @flow

import React from "react";
import png from "./bigspinner.png";
import Image from "~/renderer/components/Image";

type Props = {
  size?: number,
};

function BigSpinner({ size = 44 }: Props) {
  const defaultedSize = size || 44;
  return <Image style={{ width: defaultedSize, height: defaultedSize }} resource={png} alt="" />;
}

export default BigSpinner;
