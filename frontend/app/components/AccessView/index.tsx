import * as React from 'react';
import {GAccessEntry} from "../../generated-models";
import {useMemo} from "react";

interface AccessEntry<T> extends GAccessEntry {
  actions: T,
}

interface Props<T> {
  accessList: AccessEntry<T>[]
  allActions: any,
}

function AccessView<T>(props: Props<T>) {
  const options = useMemo(() => {
    return Object.keys(props.allActions).filter(value =>
      props.allActions[value] != 'NONE' && props.allActions[value] != 'ALL')
      .map(value => ({
        value: props.allActions[value],
        label: value,
      }))
  }, [props.allActions]);
  console.log(options);
  return (
    <div>
      Hello
    </div>
  )
};

export default AccessView;
