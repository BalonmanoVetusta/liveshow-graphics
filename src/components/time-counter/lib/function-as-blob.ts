export function functionAsBlob(fn: () => void) {
  if (!(fn instanceof Function)) {
    throw new Error("Argument must be a function");
  }

  const fnData = new Blob(["(" + fn.toString() + ")()"], {
    type: "text/javascript",
  });

  return URL.createObjectURL(fnData);
}
