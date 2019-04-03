import {mapValues} from 'lodash';

export const removeTypename = (object) => {
  if (object && object.hasOwnProperty && object.hasOwnProperty('__typename')) {
    const {__typename, ...rest} = object;
    return mapValues(rest, value => removeTypename(value));
  } else {
    return object;
  }
};
