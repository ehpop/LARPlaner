/**
 * A simple sanitizer: replace non-alphanumeric chars with underscores
 * @param name - filename to sanitize
 */
export const sanitizeFilename = (name: string) => {
  console.log("Got name: ", name);
  console.log(
    "After sanitizing: ",
    name.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
  );

  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};
