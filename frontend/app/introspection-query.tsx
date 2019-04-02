export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}

const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "GAclXenObject",
        possibleTypes: [
          {
            name: "GVM"
          },
          {
            name: "GNetwork"
          },
          {
            name: "GVDI"
          },
          {
            name: "GSR"
          },
          {
            name: "GTemplate"
          },
          {
            name: "GTask"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "GAccessEntry",
        possibleTypes: [
          {
            name: "GVMAccessEntry"
          },
          {
            name: "GNetworkAccessEntry"
          },
          {
            name: "GVDIAccessEntry"
          },
          {
            name: "GSRAccessEntry"
          },
          {
            name: "GTemplateAccessEntry"
          },
          {
            name: "GTaskAccessEntry"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "GAbstractVM",
        possibleTypes: [
          {
            name: "GVM"
          },
          {
            name: "GTemplate"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "GXenObject",
        possibleTypes: [
          {
            name: "GHost"
          },
          {
            name: "GPool"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GVMOrDeleted",
        possibleTypes: [
          {
            name: "GVM"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GTemplateOrDeleted",
        possibleTypes: [
          {
            name: "GTemplate"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GHostOrDeleted",
        possibleTypes: [
          {
            name: "GHost"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GPoolOrDeleted",
        possibleTypes: [
          {
            name: "GPool"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GNetworkOrDeleted",
        possibleTypes: [
          {
            name: "GNetwork"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GVDIOrDeleted",
        possibleTypes: [
          {
            name: "GVDI"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "GTaskOrDeleted",
        possibleTypes: [
          {
            name: "GTask"
          },
          {
            name: "Deleted"
          }
        ]
      },
      {
        kind: "UNION",
        name: "PlaybookTaskOrDeleted",
        possibleTypes: [
          {
            name: "PlaybookTask"
          },
          {
            name: "Deleted"
          }
        ]
      }
    ]
  }
};

export default result;
