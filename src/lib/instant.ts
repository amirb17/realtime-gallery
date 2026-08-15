import { init } from "@instantdb/react";

const appId = import.meta.env.VITE_INSTANT_APP_ID;

export const db = init({
  appId,
});