import React from "react";
import { View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

type Props = { size?: number; color?: string };

export default function AppLogo({ size = 28, color = "#22c55e" }: Props) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {}
        <Circle
          cx="12"
          cy="12"
          r="9"
          stroke={color}
          strokeWidth="2.2"
          fill="none"
          opacity="0.9"
        />
        <Polyline
          points="7.2,12.8 10.1,10.2 12.2,12.2 16.8,7.6"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
