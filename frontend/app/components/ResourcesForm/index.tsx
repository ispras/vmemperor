import {VmActions} from "../../generated-models";
import React, {useMemo} from "react";
import {DocumentNode} from "graphql";
import {ResourceFormValues, schema} from "./schema";
import {filterNullValuesAndTypename} from "../AbstractSettingsForm/utils";
import {AbstractSettingsForm, AbstractSettingsFormProps} from "../AbstractSettingsForm";
import {ResourcesForm} from "./form";

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

interface Props {
  vm: AbstractVM;
  mutationName: string;
  mutationNode: DocumentNode;
}

const defaults = {
  coresPerSocket: 1,
};

const mapFromFormValuesToMutationValues:
  AbstractSettingsFormProps<ResourceFormValues>["mapFromFormValuesToMutationValues"] =
  new Map<keyof ResourceFormValues, (_: any) => object>([
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
  ]);

export const ResourcesFormContainer: React.FunctionComponent<Props> = ({vm, mutationName, mutationNode}) => {
  const {platform, myActions, ...rest} = vm;
  const initialValues: ResourceFormValues = useMemo(() => {

    const obj = {
      ...defaults, ...filterNullValuesAndTypename(platform),
      VCPUsAtStartup: vm.VCPUsAtStartup, ram: Math.floor(vm.memoryStaticMin / (1024 * 1024))
    }; //If coresPerSocket is null, set it to 1 - default
    return obj;
  }, [vm, platform]);

  return (
    <AbstractSettingsForm
      initialValues={initialValues}
      mutationNode={mutationNode}
      mutationName={mutationName}
      mapFromFormValuesToMutationValues={mapFromFormValuesToMutationValues}
      validationSchema={schema}
      component={ResourcesForm}
      mutableObject={vm}/>

  );
};
