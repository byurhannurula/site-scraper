export * from "./cn";
export * from "./format";

export const isURL = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const variants = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.35,
    },
  },
  hide: {
    y: -50,
    opacity: 0,
  },
};
