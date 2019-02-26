 import { takeEvery, take,  call, put, select } from 'redux-saga/effects';

// Individual exports for testing


import {
  ISO_ATTACH,
  VDI_ATTACH,
  VDI_DETACH,
  VM_CONVERT,
  VM_REQUEST_INFO,
  VM_REQUEST_RESOURCE,
  VM_WATCH,
  NET_ACTION
} from "./constants";
import {VM_RUN_ERROR, VMLIST_MESSAGE} from "../App/constants";
 import {convert} from "../../api/vm";
 import {vm_run_error} from "../App/actions";
 import {handleVMErrors} from '../App/saga';
 import {diskInfo, netInfo} from "../../api/vm";
 import {attachdetachvdi, attachdetachiso, vdilist} from "../../api/vdi";
 import isolist from '../../api/isolist';
 import {netlist, netaction} from '../../api/net';
 import {setInfo, requestInfo as actRequestInfo, setResourceData, requestResourceData} from "./actions";
 import {makeSelectPages} from "./selectors";

 const actionHandlers = {
  [VM_CONVERT]: {
    onError: vm_run_error,
    handler: function* (args)
    {
      const data = yield call(convert, args.ref, args.mode);
      console.log("convert: data:", data);
    }
  },
   [VDI_DETACH]: {
    onError: vm_run_error,
     handler: function* (args)
     {
       const data = yield call(attachdetachvdi, args.vm, args.vdi, 'detach');
       console.log("detach: data", data);
       let pages = yield select(makeSelectPages('vdi')());
       yield put(requestResourceData('vdi', pages.page, pages.pageSize));
       pages = yield select(makeSelectPages('iso')());
       yield put(requestResourceData('iso', pages.page, pages.pageSize));
     }
   },

   [VDI_ATTACH]: {
   onError: vm_run_error,
     handler: function* (args)
   {
     console.log("handle attach");
     const data = yield call(attachdetachvdi, args.vm, args.vdi, 'attach');
     console.log("attach: data", data);
     const pages = yield select(makeSelectPages('vdi')());
     yield put(requestResourceData('vdi', pages.page, pages.pageSize));
   }
 },
   [ISO_ATTACH]: {
    onError: vm_run_error,
      handler: function* (args)
   {
     console.log("handle iso attach");
     const data = yield call(attachdetachiso, args.vm, args.iso, 'attach');
     console.log("isoattach: data", data);
     const pages = yield select(makeSelectPages('iso')());
     yield put(requestResourceData('iso', pages.page, pages.pageSize));
   }
 },
   [NET_ACTION]: {
    onError: vm_run_error,
     handler:  function* (args)
   {
     console.log("handle net action");
     const data = yield call(netaction, args.vm, args.net, args.action);
     console.log("net: data", data);
     const pages = yield select(makeSelectPages('net')());
     yield put(requestResourceData('net', pages.page, pages.pageSize));
   }
 },

};


 function* handleActions(action) {
   const {type, ...rest} = action;
   const handler = actionHandlers[type];
   console.log("vmsettings: handle " + type);
   try {
     yield handler.handler(rest);
   }
   catch (e) {
     if (e.response) {
       console.log(e.response);
       if (e.response.status === 400) {
         //Handle error
         if (e.response.data.details) {
           yield put(handler.onError(e.response.data.details));
         }
         else {
           console.error("Unhandled Response Error: ", e.response)
         }
       }
     }
   }



 }

 function* requestResource(action)
 {
   const {resourceType, page, pageSize } = action;
   let func = null;
   switch (resourceType) {
     case 'iso':
       func = isolist;
       break;
     case 'vdi':
       func = vdilist;
       break;
     case 'net':
       func = netlist;
       break;
   }

   const response = yield call(func, page, pageSize);
   yield put(setResourceData(resourceType, response.data));
 }

 function* requestInfo(action) {
   const { ref, resourceType } = action;
   let func = null;
   switch (resourceType)
   {
     case 'disk':
       func = diskInfo;
       break;
     case 'net':
       func = netInfo;
       break;
   }
   const response = yield call(func, ref);
   yield put(setInfo(resourceType, response.data));

 }

 function* vmWatch(action)
 {
   const {ref} = action;
   let disks = true;
   let networks = true;
   while(true)
   {
     const action = yield take(VMLIST_MESSAGE);
     const {message} = action;
     let value = null;
     switch(message.type)
     {
       case 'change':
         value = message.new_val;
         break;
       default:
         continue;
     }
     if (value.ref !== ref)
       continue;

     if (value.disks !== disks)
     {
       yield put(actRequestInfo('disk', ref));
     }

     if (value.networks !== networks)
     {
       yield put(actRequestInfo('net', ref));
     }

   }
 }


export default function* rootSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(VM_CONVERT, handleActions);
  yield takeEvery(VDI_DETACH, handleActions);
  yield takeEvery(VDI_ATTACH, handleActions);
  yield takeEvery(ISO_ATTACH, handleActions);
  yield takeEvery(NET_ACTION, handleActions);
  yield takeEvery(VM_REQUEST_INFO, requestInfo);
  yield takeEvery(VM_WATCH, vmWatch);
  yield takeEvery(VM_REQUEST_RESOURCE, requestResource);
}
