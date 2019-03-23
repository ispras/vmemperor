interface Response {
  reason?: string;
  granted: boolean;
}

export function filterNullValuesAndTypename(obj: object) {
  const ret = Object.assign({},
    ...Object.keys(obj).filter(key => key !== '__typename' && obj[key] !== null)
      .map(key => ({[key]: obj[key]})));
  return ret;
}

export type MapperTypeMap<T> = Map<keyof T, (any) => object>;

export function dirtyFormValuesToVariables<T>(initialValues: T, values: T, mappers: MapperTypeMap<T>) {
  /**
   * returns an object whose keys are original form value names and values are byproducts of mapper function.
   * Initial values are filtered out.
   * It is needed so that if server reports an error on  some value, we then trace it to original form value and show error in correct place
   */
  const filtered = Object.keys(values).filter(key => values[key] !== initialValues[key]);
  const ret =
    //@ts-ignore
    Object.assign({}, ...Object.entries(filtered.map(key => mappers.get(key)(values[key]))).map(([number, value]) => ({[filtered[number]]: value})));
  return ret;
}

export function invert(obj) {
  /* Invert value returned by dirtyFormValuesToVariables */
  return Object.assign({},
    ...Object.values(Object.assign({},
      ...Object.entries(obj).map(([key, value]) =>
        Object.keys(value).map(valueKey =>
          ({[valueKey]: key}))))))
}

export function split(string: string, separator: string, splits: number) {
  const array = string.split(separator);
  const splitted = array.slice(0, splits);
  const joined = array.slice(splits);
  return [...splitted, joined.join(separator)]
}

export function variablesToMutationArguments(variables) {
  /* convert value from dirtyFormValuesToVariables to mutation arguments */
  return Object.assign({}, ...Object.values(variables));
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

export function mutationErrorToFormikError(error) {
  console.log("mutationErrorToFormikError:", error);
}

export function setXenAdapterAPIError(e, invertedVariables) {
  const split = e.message.split("<XenAdapterAPIError>: ");
  console.log(split);
  if (split.length != 2)
    throw e;
  const message = JSON.parse(split[1]);
  let methodName = message.message.split("::")[1];
  if (methodName.slice(0, 4) == 'set_')
    methodName = methodName.slice(4) // remove set prefix
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
  return [invertedVariables[ourMethodName], message.details[1]];
}
