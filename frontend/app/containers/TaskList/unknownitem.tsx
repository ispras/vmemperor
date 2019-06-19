import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {useApolloClient} from "react-apollo-hooks";
import {ListGroupItem, ListGroupItemProps} from "reactstrap";
import ApolloClient from "apollo-client";
import {RouteComponentProps} from "react-router";
import {TaskFragmentFragment} from "../../generated-models";

interface MaybeUnknownItemProps {
  itemPath: string;
  itemRef?: string;
  task?: TaskFragmentFragment
  children?: ReactNode;
  history: RouteComponentProps['history'];
  getNameLabel: (client: ApolloClient<any>, ref: string) => Promise<string>;
}

/**
 * This ListGroupItem renders a maybe unknown element from the Task. Either
 * Task or itemRef should be Provided. If Task is provided, getNameLabel is invoked each time
 * task is changed AND itemRef is assumed to be task.result
 * @param itemPath
 * @param task
 * @param children
 * @param history
 * @param getNameLabel
 * @constructor
 */
export const MaybeUnknownItem: React.FunctionComponent<MaybeUnknownItemProps> =
  ({itemPath, itemRef, task, children, history, getNameLabel}) => {

    const client = useApolloClient();
    const myRef = useMemo(() => task ? task.result : itemRef, [itemRef, task]);
    const onButtonClick = () => {
      history.push(`/${itemPath}/${myRef}`);
    };
    const props: Partial<ListGroupItemProps> = myRef ? {
      tag: "button",
      action: true,
      onClick: () => onButtonClick(),
    } : {};
    const [nameLabel, setNameLabel] = useState(myRef);
    useEffect(() => {
      setTimeout(async () => {
        const _nameLabel = await getNameLabel(client, myRef);
        setNameLabel(_nameLabel);
      }, 500);
    }, [task, itemRef]);
    return <ListGroupItem {...props}>
      {children}
      {nameLabel}
    </ListGroupItem>
  };
