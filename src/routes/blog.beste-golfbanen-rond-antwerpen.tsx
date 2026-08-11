import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/beste-golfbanen-rond-antwerpen")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog/$slug",
      params: { slug: "beste-golfbanen-antwerpen" },
      statusCode: 301,
    });
  },
});
