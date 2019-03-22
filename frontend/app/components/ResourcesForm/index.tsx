import {VmActions} from "../../generated-models";
import {Formik, FormikActions, FormikConfig, FormikProps} from "formik";
import React, {useCallback, useMemo} from "react";
import {DocumentNode} from "graphql";
import {useMutation} from "react-apollo-hooks";
import {assign, map} from 'lodash';
import {ResourcesForm} from "./form";

export interface ResourceFormValues {
  VCPUsAtStartup: number;
  coresPerSocket: number;
  ram: number; //MB
}

interface AbstractVM {
  memoryStaticMin: number;
  memoryStaticMax: number;
  memoryDynamicMin: number;
  memoryDynamicMax: number;
  VCPUsAtStartup: number;
  VCPUsMax: number;
  platform: {
    coresPerSocket?: number;
  }
  myActions: VmActions[];
  ref: string;
}

/*
interface Values {
  static_memory_min: number;
  static_memory_max: number;
  dynamic_memory_min: number;
  dynamic_memory_max: number;
  VCPUsAtStartup: number;
  VCPUsMax: number;
  coresPerSocket: number;
}
*/
interface Props {
  vm: AbstractVM;
  mutationName: string;
  mutationNode: DocumentNode;
}

const defaults = {
  coresPerSocket: 1,
};

function filterNullValuesAndTypename(obj: object) {
  const ret = Object.keys(obj).filter(key => key !== '__typename' && obj[key] !== null).map(key => ({[key]: obj[key]}));
  return ret;
}

function dirtyFormValuesToVariables<T>(initialValues: T, values: T, mappers: Map<keyof T, (any) => object>) {
  const filtered = Object.keys(values).filter(key => values[key] !== initialValues[key]);
  const ret =
    //@ts-ignore
    Object.assign({}, ...Object.values(filtered.map(key => mappers.get(key)(values[key]))));
  return ret;
}


export const ResourcesFormContainer: React.FunctionComponent<Props> = ({vm, mutationName, mutationNode}) => {
  const {platform, myActions, ...rest} = vm;
  const initialValues: ResourceFormValues = useMemo(() => {

    const obj = {
      ...defaults, ...filterNullValuesAndTypename(platform),
      VCPUsAtStartup: vm.VCPUsAtStartup, ram: Math.floor(vm.memoryStaticMin / (1024 * 1024))
    }; //If coresPerSocket is null, set it to 1 - default
    return obj;
  }, [vm, platform]);
  const mutate = useMutation(mutationNode);

  const onSubmit: FormikConfig<ResourceFormValues>['onSubmit'] = useCallback(async (values: ResourceFormValues, formikActions: FormikActions<ResourceFormValues>) => {
    const dirtyValues = dirtyFormValuesToVariables(initialValues, values,
      new Map<keyof (typeof values), (_: any) => object>([
        ["VCPUsAtStartup", value => ({
          VCPUsAtStartup: value,
          VCPUsMax: value
        })],
        ["coresPerSocket", value => ({platform: {coresPerSocket: value}})],
        ["ram", value => {
          const valueBytes = value * 1024 * 1024;
          return {
            memoryStaticMin: valueBytes,
            memoryStaticMax: valueBytes,
            memoryDynamicMin: valueBytes,
            memoryDynamicMax: valueBytes,
          }
        }]
      ]));
    console.log("Dirty values: ", dirtyValues);
    if (!dirtyValues)
      return;
    await mutate({
      variables: {
        [mutationName]:
          {
            ref: vm.ref,
            ...dirtyValues
          }
      }
    });

  }, [initialValues, vm.ref]);

  return (
    <Formik initialValues={initialValues}
            onSubmit={onSubmit}
            component={ResourcesForm}
    />

  );
};
