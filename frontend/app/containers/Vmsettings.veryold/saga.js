 import { takeEvery, call, put, select } from 'redux-saga/effects';
 import vminfo from 'api/vminfo';
 import { REQUEST_VMINFO} from "./constants";
 import {setVMInfo} from "./actions";

 function* requestVmInfo(action) {
  const response = yield call(vminfo, action.ref);
    if (response.data) {
      yield put(setVMInfo(response.data));
    }
}

// Individual exports for testing
export default function* rootSaga() {
  yield takeEvery(REQUEST_VMINFO, requestVmInfo);

}
