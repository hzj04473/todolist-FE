const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

export const getSEOData = (path, pageData) => {
  const currentUrl = `${BASE_URL}${path}`;
  const defaultImage = `${BASE_URL}/og_image.png`;

  return {
    currentUrl,
    defaultImage,
    ...pageData,
  };
};
