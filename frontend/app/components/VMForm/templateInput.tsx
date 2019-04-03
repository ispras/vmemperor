import Select, {SelectFieldProps} from '../../components/Select';
import {Values} from "./props";
import {FieldProps} from "formik";
import {useEffect} from "react";
import {useApolloClient} from "react-apollo-hooks";
import {Omit} from "../AbstractSettingsForm/utils";

import * as React from "react";
import {
  TemplateNewVMOptionsDocument,
  TemplateNewVMOptionsQuery,
  TemplateNewVMOptionsQueryVariables
} from "../../generated-models";
import {removeTypename} from "../../utils/remove-typename";

export function TemplateInputField(props: SelectFieldProps<Values>) {
  const client = useApolloClient();
  const afterChange: SelectFieldProps<Values>['afterChange'] = (newValue: string) => {
    /* Sets memory, cpu parameters to those of template if user changes template settings */
    if (!props.form.touched.vmOptions || Object.entries(props.form.touched.vmOptions).filter(([key, value]) => {
      console.log("Key ", key, "touched: ", value);
      return value;
    }).length === 0) { //template values are not touched
      client.query<TemplateNewVMOptionsQuery, TemplateNewVMOptionsQueryVariables>({
        query: TemplateNewVMOptionsDocument,
        variables: {
          ref: newValue
        },
      }).then(ret => {
          if (ret.errors && ret.errors.length)
            return;
          let vmOptions = removeTypename(ret.data.template) as Values['vmOptions'];
          if (!vmOptions.platform.coresPerSocket)
            vmOptions.platform.coresPerSocket = 1;
          props.form.setFieldValue("vmOptions", vmOptions, false);
          props.form.setFieldTouched("vmOptions", false, false);
        },
        reason => {
          console.log("Template query rejected: ", reason);
        })

    }
  };
  return (
    <Select<Values>
      {...props}
      afterChange={afterChange}
    />
  )
}

