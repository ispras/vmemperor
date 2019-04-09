import {TaskColumnType} from "./index";

const nameLabelFormatter: TaskColumnType['formatter'] = (cell, row) => {
  let async = false, obj = null, method = null;
  let parts = cell.split(".");
  if (parts[0] === 'Async') {
    async = true;
    obj = parts[1];
    method = parts[2];
  } else {
    obj = parts[0];
    method = parts[1];
  }


};
