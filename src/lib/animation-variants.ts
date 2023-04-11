export const AnimationVariants = {
  left: {
    visible: {
      x: 0,
    },
    hide: {
      x: "-100%",
    },
  },

  right: {
    visible: {
      x: 0,
    },
    hide: {
      x: "100%",
    },
  },

  bottom: {
    visible: {
      y: 0,
    },
    hide: {
      y: "100%",
    },
  },

  fade: {
    visible: {
      opacity: 1,
    },
    hide: {
      opacity: 0,
    },
  },

  none: {
    visible: {},
    hide: {},
  },
};
