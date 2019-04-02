import React, {Dispatch} from 'react';
import {useEffect} from "react";
import {ListAction} from "../utils/reducer";

export const useTableSelectionInInternalState = (dispatch: Dispatch<ListAction>, selectedItems) => {
  useEffect(() => { //Re-add items to our internal state
    for (const item of selectedItems)
      dispatch({
        type: "Add",
        ref: item,
      })
  }, []);
};
