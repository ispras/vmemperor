import {useMemo} from "react";
import {SRActions, SRContentType, StorageListFragmentFragment, useStorageListQuery} from "../../generated-models";
import {useReactSelectFromRecord} from "../../hooks/form";
import formatBytes from "../../utils/sizeUtils";
import * as React from "react";
import Select, {SelectFieldProps} from '../../components/Select';
import {Field} from "formik";
import {faDatabase} from "@fortawesome/free-solid-svg-icons";

interface Props {
  fieldName: string;
}

export const SRInput: React.FC<Props> = ({fieldName}) => {
  const {data} = useStorageListQuery();
  const srs = useMemo(() => data.srs.filter(
    sr => sr.contentType === SRContentType.User &&
      !sr.PBDs.every(pbd => !pbd.currentlyAttached)
      && sr.myActions.includes(SRActions.vdi_create)
  ), [data]);

  const srOptions = useReactSelectFromRecord(srs, (item: StorageListFragmentFragment) => {
    return `${item.nameLabel} (${formatBytes(item.spaceAvailable, 2)} available)`
  });
  return (
    <Field name={fieldName}
           component={Select}
           options={srOptions}
           placeholder="Select a storage repository to create a new disk on..."
           addonIcon={faDatabase}/>
  )
};
