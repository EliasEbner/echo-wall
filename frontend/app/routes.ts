import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/mainLayout.tsx", [
    index("./screens/")
    route("/chat/:username", "./screens/chat/chat.tsx"),
  ]),
] satisfies RouteConfig;
