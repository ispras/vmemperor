import {SettingsComponentProps} from "../../containers/Settings";

enum Tab {
  Overview = 'overview',
  Access = 'access',
}

const TemplateSettingsForm: React.FunctionComponent<SettingsComponentProps<TemplateInfo.Query>>
