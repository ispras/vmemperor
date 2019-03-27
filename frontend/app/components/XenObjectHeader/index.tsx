import {DocumentNode} from "graphql";
import {useMutation} from "react-apollo-hooks";
import * as React from "react";
import {Fragment} from "react";
import ContentEditable from "react-sane-contenteditable";
import {XenObjectFragmentFragment} from "../../generated-models";


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
  const onEdit = (name: "nameLabel" | "nameDescription") => async (ev, value) => {
    if (!value.trim() || value.trim() == xenObject[name])
      return;
    console.log(ev);
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
        <ContentEditable
          tagName="h3"
          content={xenObject.nameLabel}
          editable={xenObject.myActions.includes("rename")}
          onChange={onEdit("nameLabel")}
        />
      </div>
      <h4 className="text-center">
        {children}
      </h4>
      <div className="container d-flex justify-content-center">
        <ContentEditable
          tagName="h5"
          content={xenObject.nameDescription}
          editable={xenObject.myActions.includes("rename")}
          onChange={onEdit("nameDescription")}
        />
      </div>
    </Fragment>
  );
};

export default XenObjectHeader;
