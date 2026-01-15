const parseSupabaseUrl = (url) => {
  let parsedUrl = url;
  if (url.includes("#")) {
    parsedUrl = url.replace("#", "?");
  }
  return parsedUrl;
};

export default parseSupabaseUrl;