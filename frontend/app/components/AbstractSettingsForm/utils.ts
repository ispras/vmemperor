import {transform, isEqual, isObject} from "lodash";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface Response {
  reason?: string;
  granted: boolean;
}

export function filterNullValuesAndTypename(obj: object) {
  const ret = Object.assign({},
    ...Object.keys(obj).filter(key => key !== '__typename' && obj[key] !== null)
      .map(key => {
        const value = (obj, key) => {
          if (typeof obj[key] === "object") {
            return filterNullValuesAndTypename(obj[key])
          } else {
            return obj[key];
          }
        };
        return {
          [key]: value(obj, key)
        }
      }));
  return ret;
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object, base) {
  function changes(object, base) {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }

  return changes(object, base);
}

export function findDeepField(obj: object, fieldName: string, prefix: string = "") {
  if (prefix === null || prefix === undefined) {
    prefix = "";
  }
  for (const [key, value] of Object.entries(obj)) {
    if (fieldName === key)
      return prefix + fieldName;

    if (typeof value === "object") {
      const found = findDeepField(value, fieldName, prefix + key + ".");
      if (found)
        return found;
    }
  }
  return null;
}

export function split(string: string, separator: string, splits: number) {
  const array = string.split(separator);
  const splitted = array.slice(0, splits);
  const joined = array.slice(splits);
  if (joined.length > 0)
    return [...splitted, joined.join(separator)]
  else
    return splitted;
}

export function mutationResponseToFormikErrors(response: Response) {
  /* Server-side validation is here */
  if (response.granted || !response.reason) {
    return null;
  }
  const strs = split(response.reason, ': ', 1);
  if (strs.length == 1)
    return [null, strs[0]];
  else if (strs.length == 2)
    return [strs[0], strs[1]];
  else
    throw new Error(`invalid reason format: ${response.reason}`)
}

export function setApiError(e, values) {
  const split = e.message.split("<XenAdapterAPIError>: ");
  console.log(split);
  if (split.length == 2) { //XenAdapterAPIError
    const message = JSON.parse(split[1]);
    let methodName = message.message.split("::")[1];
    if (methodName.slice(0, 4) == 'set_')
      methodName = methodName.slice(4); // remove set prefix
    //Convert to camelcase
    const toCamelCase = (string: string): string => {
      return string.split('_').map((value, index) => {
        if (index == 0)
          return value;
        else
          return value.charAt(0).toUpperCase() + value.slice(1);
      }).join('');
    };
    const ourMethodName = toCamelCase(methodName);
    return [findDeepField(values, ourMethodName), message.details[1]];
  } else {
    return [null, split[0]];
  }


}
