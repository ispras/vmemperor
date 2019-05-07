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
import {ResourcesFormContainer} from "../ApplyResetForm";
import schema from "./schema";
import defaults from "./defaults";
import MainOwnerForm from "../MainOwnerForm";

enum Tab {
  Overview = 'overview',
  Access = 'access'
}

const VDISettingsForm: React.FunctionComponent<SettingsComponentProps<VDIInfoQuery>> =
  ({object: {vdi}}) => {
    const defaultTab = Tab.Overview;
    const header = useMemo(() => (
      <XenObjectHeader
        editMutation={VDIEditOptionsDocument}
        editMutationName="vdi"
        xenObject={vdi}>
      </XenObjectHeader>
    ), [vdi.nameLabel, vdi.nameDescription]);
    const tabs: TabWidgetProps['tabs'] = new Map(
      [
        [Tab.Overview, {
          header: "Overview",
          content: (
            <ResourcesFormContainer
              object={vdi}
              mutationName="vdi"
              mutationNode={VDIEditOptionsDocument}
              defaultValues={defaults}
              schema={schema}>
              <MainOwnerForm object={vdi}/>
            </ResourcesFormContainer>
          )
        }],
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
