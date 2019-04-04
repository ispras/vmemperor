/*
 *
 * CreateVM
 *
 */

import React, {useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import styles from './styles.css'
import {Button, Collapse, Modal} from 'reactstrap';

import PoolInfo from '../../components/PoolInfo';
import {
  Change,
  PoolListDocument,
  usePoolListQuery,
  usePoolListUpdateSubscription
} from "../../generated-models";
import {handleAddOfValue, handleAddRemove, handleRemoveOfValueByRef} from "../../utils/cacheUtils";
import VMFormContainer from "../../components/VMForm";


const CreateVM = () => {
  const {data: {pools}} = usePoolListQuery();

  usePoolListUpdateSubscription({
    onSubscriptionData({client, subscriptionData}) {
      const change = subscriptionData.data.pools;
      handleAddRemove(client, PoolListDocument, 'pools', change);
    },

  });

  const [showForm, setShowForm] = useState(false); //This is modality of CreateVM form
  const buttonText = useMemo(() => {
    if (showForm)
      return "Go back to pool info";
    else
      return "Create VM";

  }, [showForm]);
  return (
    <div>
      <Button primary={true}
              block={true}
              onClick={() => setShowForm(!showForm)}>
        {buttonText}
      </Button>

      <Collapse
        isOpen={!showForm}
      >
        <div className={styles.poolsContainer}>
          {
            pools.length > 0 ?
              pools.map(pool => <PoolInfo key={pool.ref} pool={pool}/>)
              : <h1>No pools available</h1>

          }
        </div>
      </Collapse>
      <Collapse
        isOpen={showForm}>
        <VMFormContainer/>
      </Collapse>
    </div>
  );


};
export default CreateVM;

