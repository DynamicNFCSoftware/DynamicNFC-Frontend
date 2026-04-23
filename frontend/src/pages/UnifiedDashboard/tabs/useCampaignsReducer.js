/**
 * useCampaignsReducer.js
 * Reducer hook for CampaignsTab state management
 * Consolidates 13 useState hooks into a single useReducer
 */

export const initialState = {
  search: "",
  statusFilter: "all",
  sourceFilter: "all",
  sortKey: "newest",
  kpiFilter: "",
  selectedCampaign: null,
  showAddModal: false,
  editingId: "",
  editingName: "",
  renameError: "",
  toast: "",
  actionBusy: "",
  tapMetricsByCampaign: {},
};

export function campaignsReducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };

    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload, kpiFilter: "" };

    case "SET_SOURCE_FILTER":
      return { ...state, sourceFilter: action.payload };

    case "SET_SORT_KEY":
      return { ...state, sortKey: action.payload };

    case "SET_KPI_FILTER": {
      const newKpiFilter = state.kpiFilter === action.payload ? "" : action.payload;
      return { ...state, kpiFilter: newKpiFilter };
    }

    case "SET_SELECTED_CAMPAIGN":
      return { ...state, selectedCampaign: action.payload };

    case "UPDATE_SELECTED_CAMPAIGN":
      return {
        ...state,
        selectedCampaign: state.selectedCampaign
          ? { ...state.selectedCampaign, ...action.payload }
          : null,
      };

    case "SHOW_ADD_MODAL":
      return { ...state, showAddModal: true };

    case "CLOSE_ADD_MODAL":
      return { ...state, showAddModal: false };

    case "START_RENAME":
      return {
        ...state,
        editingId: action.payload.id,
        editingName: action.payload.name,
        renameError: "",
      };

    case "CANCEL_RENAME":
      return { ...state, editingId: "", editingName: "", renameError: "" };

    case "SET_EDITING_NAME":
      return { ...state, editingName: action.payload, renameError: "" };

    case "SET_RENAME_ERROR":
      return { ...state, renameError: action.payload };

    case "SET_TOAST":
      return { ...state, toast: action.payload };

    case "SET_ACTION_BUSY":
      return { ...state, actionBusy: action.payload };

    case "SET_TAP_METRICS":
      return { ...state, tapMetricsByCampaign: action.payload };

    case "CLEAR_FILTERS":
      return {
        ...state,
        search: "",
        statusFilter: "all",
        sourceFilter: "all",
        kpiFilter: "",
      };

    case "HYDRATE_FILTERS":
      return {
        ...state,
        search: action.payload.search,
        statusFilter: action.payload.statusFilter,
        sourceFilter: action.payload.sourceFilter,
        sortKey: action.payload.sortKey,
      };

    default:
      return state;
  }
}
