import {DocumentNode} from "graphql";
import {useMutation} from "react-apollo-hooks";
import * as React from "react";
import {Fragment} from "react";
import {XenObjectFragmentFragment} from "../../generated-models";
import Edit from 'react-easy-edit';

interface XenObject extends XenObjectFragmentFragment {
  myActions: any[];
}

interface Props {
  editMutation: DocumentNode;
  editMutationName: string;
  children: React.ReactNode;
  xenObject: XenObject;
}


const XenObjectHeader: React.FunctionComponent<Props> = ({editMutation, editMutationName, xenObject, children}) => {
  const edit = useMutation(editMutation);
  const onEdit = (name: "nameLabel" | "nameDescription") => async (value) => {
    if (!value)
      value = "";
    if (value.trim() == xenObject[name])
      return;
    await edit({
      variables: {
        [editMutationName]:
          {
            [name]: value,
            ref: xenObject.ref,
          }
      }
    });
  };


  return (
    <Fragment>
      <div className="container d-flex justify-content-center">
        <h3>
          <Edit
            type="text"
            allowEdit={xenObject.myActions.includes("rename")}
            onSave={onEdit("nameLabel")}
            placeholder="Click to edit name"
            value={xenObject.nameLabel}
        />
        </h3>
      </div>
      <h4 className="text-center">
        {children}
      </h4>
      <div className="container d-flex justify-content-center">
        <Edit
          type="text"
          placeholder="Click to edit description"
          value={xenObject.nameDescription}
          allowEdit={xenObject.myActions.includes("rename")}
          onSave={onEdit("nameDescription")}
        />
      </div>
    </Fragment>
  );
};

export default XenObjectHeader;
