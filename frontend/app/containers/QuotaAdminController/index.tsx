import {SelectUserForForm} from "./selectUserForForm";
import {Formik, FormikConfig} from "formik";
import {
  Quota, QuotaGetDocument,
  QuotaGetQuery, QuotaGetQueryVariables,
  QuotaSetMutationVariables,
  useQuotaGetQuery,
  useQuotaSetMutation, User, UserGetDocument, UserGetQuery, UserGetQueryVariables
} from "../../generated-models";
import {useApolloClient} from "react-apollo-hooks";
import {useEffect, useState} from "react";
import * as React from "react";
import {QuotaAdminControllerForm} from "./form";
import {schema} from "./schema";
import {RouteComponentProps} from "react-router";
import {removeTypename} from "../../utils/remove-typename";

type QuotaFormikConfig = FormikConfig<Quota>;

interface Args {
  userType?: string;
  user?: string; //User id
}

/*
* Quota admin form. UI user is named "Admin" later in the text
 * Admin can choose a user and impose various quotas on said user
 * The defaults are updated once admin chooses a user to impose quotas on.
 * The admin can choose which quota to impose by checking a checkbox
 * If admin is yet to choose a user, no inputs besides user input are shown
 */
export const QuotaAdminController: React.FC<RouteComponentProps<Args>> =
  ({history, match: {params: {userType, user}}}) => {
    const userId = userType && user ? `${userType}/${user}` : null;
    const client = useApolloClient();
    const [defaultValues, setDefaultValues] = useState<Quota>({
      user: null,
      vcpuCount: null,
      vdiSize: null,
      vmCount: null,
      memory: null,
    });

    useEffect(() => {
        const func = async () => {
            console.log("Loading user data:", userId);
            const {data: {quota}} = await client.query<QuotaGetQuery, QuotaGetQueryVariables>({
              query: QuotaGetDocument,
              variables: {
                userId
              },
              fetchPolicy: "network-only"
            });
            const {data: {user}} = await client.query<UserGetQuery, UserGetQueryVariables>({
              query: UserGetDocument,
              variables: {
                userId
              }
            });
            const newDefaultValues = removeTypename(quota);
            setDefaultValues({
              user,
              ...newDefaultValues
            });
          }
        ;
        if (userId)
          func();
      }, [userId]
    );

    const onUserChanged = (userId: string) => {
      history.push(`/quota/${userId}`);
    };

    const setQuota = useQuotaSetMutation();
    const onSumbit: QuotaFormikConfig['onSubmit']
      = async (values, formikActions) => {
      const {user, ...rest} = values;
      const mutationValues: QuotaSetMutationVariables = {
        userId: user.id,
        quota: rest,
      };
      const result = await setQuota({
        variables: mutationValues
      });
      if (!result.data.quotaSet.success) {
        formikActions.setStatus({'error': "Unable to set quota"})
      } else { //Trigger reloading data
      }

    };

    return (
      <Formik initialValues={defaultValues}
              isInitialValid={false}
              enableReinitialize={true}
              onSubmit={onSumbit}
              render={props => (
                <QuotaAdminControllerForm
                  {...props}
                  onUserChanged={onUserChanged}
                />
              )}
              validationSchema={schema}
      />
    )
  }
