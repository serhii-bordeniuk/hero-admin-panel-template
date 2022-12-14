import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: 'idle',
//   activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: "idle",
});

export const fetchFilters = createAsyncThunk("filters/fetchFilters", () => {
    const { request } = useHttp();
    return request("https://6308173c46372013f5762546.mockapi.io/filters");
});

const filtersSlice = createSlice({
    name: "filrers",
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, (state) => {
                state.filtersLoadingStatus = "loading";
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = "idle";
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, (state) => {
                state.filtersLoadingStatus = "error";
            })
            .addCase(() => {});
    },
});

const { actions, reducer } = filtersSlice;

export default reducer;

export const { selectAll } = filtersAdapter.getSelectors((state) => state.filters);

export const { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } =
    actions;
