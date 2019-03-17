/*
 *
 * CreateVm
 *
 */

import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import messages from './messages';
import styles from './styles.css'
import {Button, Modal} from 'reactstrap';

import PoolInfo from '../../components/PoolInfo';
import {useQuery} from "react-apollo-hooks";
import {Change, PoolList, PoolListUpdate} from "../../generated-models";
import {useSubscription} from "../../hooks/subscription";
import {handleAddOfValue, handleAddRemove, handleRemoveOfValueByRef} from "../../utils/cacheUtils";
import VMFormContainer from "../../components/VMForm";


const CreateVM = () => {
  const {data: {pools}} = useQuery<PoolList.Query>(PoolList.Document);

  useSubscription<PoolListUpdate.Subscription>(PoolListUpdate.Document, {
    onSubscriptionData({client, subscriptionData}) {
      const change = subscriptionData.pools;
      handleAddRemove(client, PoolList.Document, 'pools', change);
    },

  });

  const [modal, setModal] = useState(false); //This is modality of CreateVM form
  const toggleModal = (e: Event) => {
    if (!modal || confirm("Do you want to leave?")) {
      setModal(!modal);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div>
      <Button primary={true} onClick={() => setModal(true)}>Create VM</Button>
      <div className={styles.poolsContainer}>
        {
          pools.length > 0 ?
            pools.map(pool => <PoolInfo key={pool.ref} pool={pool}/>)
            : <h1>No pools available</h1>

        }
      </div>

      <Modal
        lg={true}
        toggle={toggleModal}
        isOpen={modal}>
        <VMFormContainer/>
      </Modal>
    </div>
  );


};
export default CreateVM;

