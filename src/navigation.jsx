let navigateFn = null;

export const setNavigate = (nav) => {
  navigateFn = nav;
};

export const getNavigate = () => navigateFn;
