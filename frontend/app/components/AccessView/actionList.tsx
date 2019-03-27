import * as React from "react";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import {Button, ListGroup, Label, Modal} from "reactstrap";
import {AccessEntry} from "./index";
import {useCallback, useState, Fragment, useEffect} from "react";
import {Set} from 'immutable';
import {UncontrolledTooltip} from "reactstrap";
import {User, VMActions} from "../../generated-models";
import {useMutation} from "react-apollo-hooks";
import {DocumentNode} from "graphql";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import SelectUsersForGrant from "./selectUsersForGrant";


export interface MutationVariables<T> {
  actions: T[];
  user?: string;
  ref: string;
  revoke: boolean;
}

export interface Props<T> {
  actions: T[],
  user?: User,
  isOwner: boolean;
  refs: string[];
  mutationNode: DocumentNode;
  mutationName: string;
  ALL: T,
}

function ActionList<T>({actions, user, isOwner, refs, mutationNode, ALL}: Props<T>) {
  type MyVariables = MutationVariables<T>;
  if (isOwner) {
    const [selectedItems, setSelectedItems] = useState(Set.of<T>());
    const [userSelectionModal, setUserSelectionModal] = useState(false);
    const [makeOwner, setMakeOwner] = useState(false);
    const onToggle = useCallback((id: T) => {
      setSelectedItems(selectedItems.has(id) ? selectedItems.remove(id) : selectedItems.add(id));
    }, [setSelectedItems, selectedItems]);
    useEffect(() => {
      setSelectedItems(selectedItems.intersect(actions)) //Deselect selected items when they are removed from entry actions list
    });
    const onAccessSetMutation = useMutation<any, MyVariables>(mutationNode);

    const onRevoke = useCallback(async () => {
      if (!user) {
        return null;
      }
      for (const ref of refs) {
        await onAccessSetMutation({
          variables: {
            ref,
            actions: selectedItems.toArray(),
            user: user.id,
            revoke: true,
          }
        });
      }
    }, [user, refs, selectedItems]);

    const onGrantRequested = useCallback(async (users: Array<User>) => {
      if (user)
        return null;
      for (const user of users) {
        for (const ref of refs) {
          await onAccessSetMutation({
            variables: {
              ref,
              actions: makeOwner ? [ALL] : selectedItems.toArray(),
              user: user.id,
              revoke: false,
            }

          });
        }
      }
      setUserSelectionModal(false);

    }, [user, refs, selectedItems, ALL, makeOwner]);
    const onSelectDeselect = useCallback(() => {
        if (selectedItems.count() == actions.length) {
          setSelectedItems(selectedItems.clear());
        } else {
          setSelectedItems(selectedItems.union(actions));
        }
      },
      [actions, selectedItems, setSelectedItems]);

    return (
      <Fragment>
        <Row>
          <Col sm={12}>
            <Label><h3>Assigned actions {!user && (<span>(You can grant)</span>)}</h3></Label>
          </Col>
        </Row>
        <Row>
          <ButtonGroup size="lg">
            <Button
              onClick={() => onSelectDeselect()}>
              {selectedItems.count() == actions.length ? "Deselect all" : "Select all"}
            </Button>
            {user && (
              <Button
                color="danger"
                outline
                className="float-right"
                disabled={selectedItems.isEmpty()}
                onClick={async () => await onRevoke()}
              >
                Revoke
              </Button>
            ) || /* this is You tab */ (
              <Fragment>
                <Button
                  color="primary"
                  outline
                  className="float-right"
                  disabled={selectedItems.isEmpty()}
                  onClick={() => {
                    setMakeOwner(false);
                    setUserSelectionModal(true);
                  }}
                >
                  Grant Actions...
                </Button>
                <Button
                  color="danger"
                  className="float-right"
                  onClick={() => {
                    setMakeOwner(true);
                    setUserSelectionModal(true);
                  }}
                >
                  Make Owner
                </Button>
                <Modal isOpen={userSelectionModal}>
                  <SelectUsersForGrant
                    onGrantRequested={onGrantRequested}/>
                  <Button onClick={() => setUserSelectionModal(false)}
                          color="secondary"
                  >
                    Cancel...
                  </Button>
                </Modal>
              </Fragment>
            )}
          </ButtonGroup>
        </Row>
        <Row>
          <ListGroup id="list-group-user-actions" title={"Click on items to select if you want to revoke them"}>
            {actions.map(action => (
              <ListGroupItem onClick={() => onToggle(action)} active={selectedItems.has(action)} action={true}>
                {action}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>

      </Fragment>
    )
  } else {
    return (
      <ListGroup>
        {actions.map(action => (
          <ListGroupItem>
            {action}
          </ListGroupItem>
        ))}
      </ListGroup>
    )
  }
}

export default ActionList;
