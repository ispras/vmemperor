export type TReadCacheFunctionForButtonTitle = (ref: string) => { nameLabel: string };
export const buttonTitle = (startswith: string, selectionArray: Array<string>, readCacheFunction: TReadCacheFunctionForButtonTitle) => {
  let ret = startswith;
  for (let i = 0; i < selectionArray.length; ++i) {
    ret += `"${readCacheFunction(selectionArray[i]).nameLabel}"`;
    if (i < selectionArray.length - 1)
      ret += ', ';
  }
  return ret;
};
