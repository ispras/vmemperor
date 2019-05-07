import {SettingsComponentProps} from "../../containers/Settings";
import {
  PoolAccessSetMutationDocument,
  PoolActions,
  PoolEditOptionsDocument,
  PoolInfoQuery
} from "../../generated-models";
import AccessView from "../AccessView";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import * as React from "react";
import XenObjectHeader from "../XenObjectHeader";
import {useMemo} from "react";

enum Tab {
  Access = 'access'

}

export const PoolSettingsForm: React.FunctionComponent<SettingsComponentProps<PoolInfoQuery>> = ({object: {pool}}) => {
  const defaultTab = Tab.Access;
  const header = useMemo(() => (
    <XenObjectHeader
      editMutation={PoolEditOptionsDocument}
      editMutationName="pool"
      xenObject={pool}>
    </XenObjectHeader>
  ), [pool.nameLabel, pool.nameDescription]);
  const tabs: TabWidgetProps['tabs'] = new Map(
    [
      [Tab.Access, {
        header: "Access",
        content: (
          <AccessView
            data={pool}
            ALL={PoolActions.ALL}
            mutationNode={PoolAccessSetMutationDocument}
            mutationName="poolAccessSet"/>
        )
      }

      ]
    ]
  );
  return (
    <TabWidget
      tabs={tabs}
      header={header}
      defaultTab={defaultTab}/>
  );
};
