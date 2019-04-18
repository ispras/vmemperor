import React, {ReactNode, useEffect, useState} from "react";
import {useApolloClient} from "react-apollo-hooks";
import {ListGroupItem, ListGroupItemProps} from "reactstrap";
import ApolloClient from "apollo-client";
import {RouteComponentProps} from "react-router";

interface MaybeUnknownItemProps {
  itemPath: string;
  itemRef: string;
  children?: ReactNode;
  history: RouteComponentProps['history'];
  getNameLabel: (client: ApolloClient<any>, ref: string) => Promise<string>;
}


export const MaybeUnknownItem: React.FunctionComponent<MaybeUnknownItemProps> =
  ({itemPath, itemRef, children, history, getNameLabel}) => {
    const client = useApolloClient();
    const onButtonClick = () => {
      history.push(`/${itemPath}/${itemRef}`);
    };
    const props: Partial<ListGroupItemProps> = itemRef ? {
      tag: "button",
      action: true,
      onClick: () => onButtonClick(),
    } : {};
    const [nameLabel, setNameLabel] = useState(itemRef);
    useEffect(() => {
      const func = async () => {
        const _nameLabel = await getNameLabel(client, itemRef);
        setNameLabel(_nameLabel);
      };
      func();
    }, [itemRef]);
    return <ListGroupItem {...props}>
      {children}
      {nameLabel}
    </ListGroupItem>
  };
