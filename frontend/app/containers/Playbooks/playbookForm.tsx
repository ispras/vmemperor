import React, {PureComponent, useCallback, useEffect, useMemo, useState} from 'react';
import {AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import Field from './field';
//import Input from '../../components/Input';
import FullHeightCard from '../../components/FullHeightCard';
import {CardTitle, CardBody, CardSubtitle, CardText, Label, FormGroup, FormText, Button, Input} from 'reactstrap';
import {useLaunchPlaybookMutation} from "../../generated-models";
import {OrderedMap} from "immutable";

import {mapValues} from 'lodash';
import CardFooter from "reactstrap/lib/CardFooter";
import PlaybookWatcher from "../../components/PlaybookWatcher";
import {GPlaybook} from "../../generated-models";


interface Props {
  book: GPlaybook
  vms: string[]
}

type VariableList = OrderedMap<string, string | number | boolean> | null;
type VariableValue = string | number | boolean;
type VariableName = string;

type OriginalVariableList = OrderedMap<string, VariableDescription>;

interface State {
  variables: VariableList
  originalVariables: OriginalVariableList
}

interface OptionVariableValue {
  value: boolean | string | number;
  description: string;
}

const PlaybookForm = ({book, vms}: Props) => {

  const originalVariables = useMemo(() => {
    if (book.variables) {
      return JSON.parse(book.variables);
    } else {
      return null;
    }
  }, [book.variables]);
  const initialVariableState = useMemo(() => {
    return mapValues(originalVariables, v => v.value);
  }, [originalVariables]);


  const [variables, setVariables] = useState(OrderedMap<VariableName, VariableValue>(initialVariableState));

  const onInputTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVariables(variables.set(e.target.name, e.target.value));
  }, [setVariables, variables]);

  const launch = useLaunchPlaybookMutation();
  const [currentTaskId, setCurrentTaskId] = useState<string>(null);

  const onSubmit = useCallback(async (e: Event) => {
    e.preventDefault();
    const {data} = await launch(
      {
        variables: {
          id: book.id,
          vms,
          variables: JSON.stringify(variables.toJS()),
        }
      }
    );
    setCurrentTaskId(data.playbookLaunch.taskId);
  }, [book.id, vms, variables, setCurrentTaskId]);

  const generateField = useCallback((id) => {
    const fieldValue = variables.get(id);
    const field = originalVariables[id];
    let fieldType = null;
    switch (field.type) {
      case 'str': // field type ""
        fieldType = 'text';
        break;
      case 'int':
        fieldType = 'number';
        break;

    }
    let label = null;
    let multiple = false;
    if (field.type === 'option' && field.multiple) {
      multiple = true;
    }

    if (field.description) {
      label = field.description;
    } else {
      label = id;
    }

    if (fieldType) {
      return (<Field
        onChange={onInputTextChange}
        key={id}
        id={id}
        name={id}
        label={label}
        type={fieldType}
        multiple={multiple}
        value={fieldValue}
        helpMessage={id}
        required
      />)

    } else if (field.type === 'bool') {
      return (
        <FormGroup>
          <AvGroup check>
            <Label check>
              <AvInput
                onChange={onInputTextChange}
                key={id}
                type="checkbox"
                name={id}
                id={id}
              />
              {label}
            </Label>
            <FormText>{id}</FormText>
          </AvGroup>
        </FormGroup>
      );
    } else if (field.type === 'option') {
      return (
        <Field type="select"
               onChange={onInputTextChange}
               key={id}
               name={id}
               id={id}
               helpMessage={id}
               multiple={multiple}
               label={label}

        >
          {Object.entries(field.options).map(([k, v]) => {
            //@ts-ignore
            let value = v.value;
            if (typeof value === 'boolean')
              value = value.toString();
            //@ts-ignore
            return (<option key={k} value={value}>{v.description}</option>);
          })}
        </Field>
      )
    }
  }, [originalVariables, variables, onInputTextChange]);

  return (
    <FullHeightCard>
      <CardBody>
        <CardTitle>{book.name}</CardTitle>
        <CardSubtitle>{book.description}</CardSubtitle>
        <CardText>
          <AvForm onValidSubmit={onSubmit}>
            {
              Object.keys(originalVariables).map(key => generateField(key))
            }
            <Button primary type="submit" block>
              Play
            </Button>
          </AvForm>
        </CardText>
      </CardBody>
      {currentTaskId && (
        <CardFooter>
          <PlaybookWatcher taskId={currentTaskId} key={currentTaskId}/>
        </CardFooter>
      )}
    </FullHeightCard>);
};
export default PlaybookForm;

