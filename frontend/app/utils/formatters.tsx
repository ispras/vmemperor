import React from "react";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import formatBytes from "./sizeUtils";

export const checkBoxFormatter = (cell, row) => {
  if (cell) {
    return (<span>
        {cell && (<FontAwesomeIcon icon={faCheck}/>)}
    </span>);
  }
};
export const sizeFormatter = (cell, row) => {
  if (cell)
    return formatBytes(cell, 2);
  else
    return "&mdash;"
};

export function nameFormatter(column, colIndex, {sortElement, filterElement}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {column.text}
      {filterElement}
      {sortElement}
    </div>
  );
}

export function plainFormatter(column, colIndex, {sortElement, filterElement}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {column.text}
      {filterElement}
      {sortElement}
    </div>
  );
}
