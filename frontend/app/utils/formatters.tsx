import React from "react";
import {icon} from "@fortawesome/fontawesome-svg-core";
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
