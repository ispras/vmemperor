import {SettingsComponentProps} from "../../containers/Settings";
import {
  NetworkAccessSetMutationDocument,
  NetworkActions,
  NetworkEditOptionsDocument,
  NetworkInfoQuery
} from "../../generated-models";
import {useMemo} from "react";
import XenObjectHeader from "../XenObjectHeader";
import * as React from "react";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import AccessView from "../AccessView";

enum Tab {
  Access = 'access'
}

const NetworkSettingsForm: React.FunctionComponent<SettingsComponentProps<NetworkInfoQuery>> =
  ({object: {network}}) => {
    const defaultTab = Tab.Access;
    const header = useMemo(() => (
      <XenObjectHeader
        editMutation={NetworkEditOptionsDocument}
        editMutationName="network"
        xenObject={network}>
      </XenObjectHeader>
    ), [network.nameLabel, network.nameDescription]);
    const tabs: TabWidgetProps['tabs'] = new Map(
      [
        [Tab.Access, {
          header: "Access",
          content: (
            <AccessView
              data={network}
              ALL={NetworkActions.ALL}
              mutationNode={NetworkAccessSetMutationDocument}
              mutationName="netAccessSet"/>
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

export default NetworkSettingsForm;
