/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/account` | `/(tabs)/booking` | `/(tabs)/contact` | `/(tabs)/qa` | `/(tabs)/settings` | `/_sitemap` | `/account` | `/booking` | `/contact` | `/pnr-checker` | `/qa` | `/settings` | `/station-layout` | `/train-timetable`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
