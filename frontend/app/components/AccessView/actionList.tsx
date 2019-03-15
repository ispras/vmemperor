import * as React from "react";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import {Button, ListGroup, Label} from "reactstrap";
import {AccessEntry} from "./index";
import {useCallback, useState, Fragment, useEffect} from "react";
import {Set} from 'immutable';
import {UncontrolledTooltip} from "reactstrap";
import {VmActions} from "../../generated-models";
import {useMutation} from "react-apollo-hooks";
import {DocumentNode} from "graphql";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

interface MutationVariables<T> {
  actions: T[];
  user: string;
  ref: string;
  revoke: boolean;
}


interface Props<T> {
  entry: AccessEntry<T>;
  isOwner: boolean;
  _ref: string;
  mutationNode: DocumentNode;
  mutationName: string;
}

function ActionList<T>({entry, isOwner, _ref, mutationNode}: Props<T>) {
  type MyVariables = MutationVariables<T>;
  if (isOwner) {
    const [selectedItems, setSelectedItems] = useState(Set.of<T>());
    const onToggle = useCallback((id: T) => {
      setSelectedItems(selectedItems.has(id) ? selectedItems.remove(id) : selectedItems.add(id));
    }, [setSelectedItems, selectedItems]);
    useEffect(() => {
      setSelectedItems(selectedItems.intersect(entry.actions)) //Deselect selected items when they are removed from entry actions list
    });
    const onRevokeMutation = useMutation<any, MyVariables>(mutationNode);
    const onRevoke = useCallback(async () => {
      await onRevokeMutation({
        variables: {
          ref: _ref,
          actions: selectedItems.toArray(),
          user: entry.userId.id,
          revoke: true,
        }
      })
    }, [entry, _ref, selectedItems]);

    const onSelectDeselect = useCallback(() => {
        if (selectedItems.count() == entry.actions.length) {
          setSelectedItems(selectedItems.clear());
        } else {
          setSelectedItems(selectedItems.union(entry.actions));
        }
      },
      [entry, selectedItems, setSelectedItems]);

    return (
      <Fragment>
        <Row>
          <Col>
            <Label><h3>Assigned actions:</h3></Label>
          </Col>
          <Col>
            <Button
              size="lg"
              color="success"
              className="float-left"
            >
              Grant actions...
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>

            <ListGroup id="list-group-user-actions" title={"Click on items to select if you want to revoke them"}>
              {entry.actions.map(action => (
                <ListGroupItem onClick={() => onToggle(action)} active={selectedItems.has(action)} action={true}>
                  {action}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <ButtonGroup size="lg"
                         className="align-content-end">
              <Button
                onClick={() => onSelectDeselect()}>
                {selectedItems.count() == entry.actions.length ? "Deselect all" : "Select all"}
              </Button>
              <Button
                color="danger"
                outline
                className="float-left"
                disabled={selectedItems.isEmpty()}
                onClick={async () => await onRevoke()}
              >
                Revoke
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Fragment>
    )
  } else {
    return (
      <ListGroup>
        {entry.actions.map(action => (
          <ListGroupItem>
            {action}
          </ListGroupItem>
        ))}
      </ListGroup>
    )
  }
}

export default ActionList;
