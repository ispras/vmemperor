import {SettingsComponentProps} from "../../containers/Settings";
import {
  SRAccessSetMutationDocument,
  SRActions,
  SREditOptionsDocument,
  SRInfoQuery
} from "../../generated-models";
import {useMemo} from "react";
import XenObjectHeader from "../XenObjectHeader";
import * as React from "react";
import {TabWidget, TabWidgetProps} from "../TabWidget";
import AccessView from "../AccessView";

enum Tab {
  Access = 'access'
}

const SRSettingsForm: React.FunctionComponent<SettingsComponentProps<SRInfoQuery>> =
  ({object: {sr}}) => {
    const defaultTab = Tab.Access;
    const header = useMemo(() => (
      <XenObjectHeader
        editMutation={SREditOptionsDocument}
        editMutationName="sr"
        xenObject={sr}>
      </XenObjectHeader>
    ), [sr.nameLabel, sr.nameDescription]);
    const tabs: TabWidgetProps['tabs'] = new Map(
      [
        [Tab.Access, {
          header: "Access",
          content: (
            <AccessView
              data={sr}
              ALL={SRActions.ALL}
              mutationNode={SRAccessSetMutationDocument}
              mutationName="srAccessSet"/>
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

export default SRSettingsForm;
