import React from "react";
import { View } from "react-native";
import Logo from "../assets/logo.svg";

type Props = { width?: number; height?: number };

export default function AppLogo({ width = 28, height = 32 }: Props) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Logo width={width} height={height} />
    </View>
  );
}
