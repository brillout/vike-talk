import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import { Layout } from "../layouts/LayoutDefault.js";

export default {
  Layout,
  title: "Vike Talk",
  extends: vikeReact,
} satisfies Config;
