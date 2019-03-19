export interface ListAction {
  type: "Add" | "Change" | "Remove";
  ref: string;

}
