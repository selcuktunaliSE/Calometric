import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Calometric",
  slug: "calometric",
  scheme: "calometric",
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
});
