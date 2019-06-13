export const getDriveName = (userdevice) => {
  const num = Number(userdevice);
  return `xvd${String.fromCharCode('a'.charCodeAt(0) + num)}`
};
