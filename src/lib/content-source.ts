export const useStaticContent =
  process.env.NODE_ENV !== "production" &&
  process.env.CONTENT_SOURCE !== "payload";
