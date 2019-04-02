import {SettingsComponentProps} from "../../containers/Settings";
import {
  VDIAccessSetMutationDocument,
  VDIActions,
  VDIEditOptionsDocument,
  VDIInfoQuery
} from "../../generated-models";
import {useMemo} from "react";
import XenObjectHeader from "../XenObjectHeader";
import * as React from "react";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import AccessView from "../AccessView";

enum Tab {
  Access = 'access'
}

const VDISettingsForm: React.FunctionComponent<SettingsComponentProps<VDIInfoQuery>> =
  ({object: {vdi}}) => {
    const defaultTab = Tab.Access;
    const header = useMemo(() => (
      <XenObjectHeader
        editMutation={VDIEditOptionsDocument}
        editMutationName="vdi"
        xenObject={vdi}>
      </XenObjectHeader>
    ), [vdi.nameLabel, vdi.nameDescription]);
    const tabs: TabWidgetProps['tabs'] = new Map(
      [
        [Tab.Access, {
          header: "Access",
          content: (
            <AccessView
              data={vdi}
              ALL={VDIActions.ALL}
              mutationNode={VDIAccessSetMutationDocument}
              mutationName="vdiAccessSet"/>
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

export default VDISettingsForm;
