import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchData = createAsyncThunk(
    'pricelists/get',
    async (param, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + '/mapping_price', param);
            let data = '';
            let _data = response;
            let res = {};
            if (response.status === 200) {
                let dataa = _data.data;
                data = dataa.data;
                if (dataa.err_code === '00') {
                    res = {
                        data: data,
                        totalData: dataa.total_data,
                        nama_cargo: dataa.nama_cargo,                        
                    }
                    return res;
                } else {
                    res = {
                        err_msg: dataa.err_msg
                    }
                    return thunkAPI.rejectWithValue(res);
                }
            } else {

                return thunkAPI.rejectWithValue(_data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const addData = createAsyncThunk(
    'pricelists/storeData',
    async (param, thunkAPI) => {
        let res = {};

        try {
            const response = await axios.post(API_URL + '/set_price', param);
            //let data = '';
            let _data = response;
            if (response.status === 200) {
                let dataa = _data.data;
                //data = dataa.data;
                if (dataa.err_code === '00') {
                    return dataa;
                } else {
                    res = {
                        isAddLoading: false,
                        showFormSuccess: false,
                        showFormAdd: true,
                        err_msg: dataa.err_msg,
                        contentMsg: null,
                    }
                    return thunkAPI.rejectWithValue(res);
                }
            } else {
                res = {
                    isAddLoading: false,
                    showFormSuccess: true,
                    showFormAdd: false,
                    contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                    err_msg: null
                }
                console.log('Error', _data);
                return thunkAPI.rejectWithValue(res);
            }
        } catch (e) {
            res = {
                isAddLoading: false,
                showFormSuccess: true,
                showFormAdd: false,
                contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                err_msg: null
            }
            console.log('Error catch', e.response.data);
            return thunkAPI.rejectWithValue(res);
        }
    }
);

const initialState = {
    data: [],
    namaCargo: '',
    totalData: 0,
    isError: false,
    isLoading: false,
    isAddLoading: false,
    showFormAdd: false,
};


export const pricelistSlice = createSlice({
    name: 'pricelists',
    initialState,
    reducers: {
        setData: (state, { payload }) => {
            state.data = payload;
            return state;
        },
        addForm: (state) => {
            state.isAddLoading = false;
            state.showFormAdd = true;
            return state;
        },
        closeForm: (state) => {
            state.showFormAdd = false;
        },
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, { payload }) => {
            state.totalData = payload.totalData;
            state.data = payload.data;
            state.namaCargo = payload.nama_cargo;           
            state.isLoading = false;
            state.isError = false;
            //return state;
        },
        [fetchData.rejected]: (state, { payload }) => {
            //console.log('payload', payload);
            state.isLoading = false;
            state.isError = true;

        },
        [fetchData.pending]: (state) => {
            state.isLoading = true;
            state.namaCargo = '';
        },
        [addData.fulfilled]: (state) => {
            state.isError = false;
        },
        [addData.rejected]: (state) => {
            state.isError = true;

        },
        [addData.pending]: (state) => {
            state.isAddLoading = true;
        },

    }
})

export const { setData, addForm, closeForm } = pricelistSlice.actions;
export const userSelector = (state) => state.pricelists;
