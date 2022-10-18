import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import "moment/locale/id";

const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;
const API_URL = process.env.REACT_APP_URL_API;

export const loginUser = createAsyncThunk(
    'users/login',
    async ({username, pass}, thunkAPI) => {

        try {
            const response = await fetch(
                API_URL + '/login_admin',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "username": username,
                        "pass": pass,
                    }),
                }
            );
            let token = '';
            let data = '';
            let _data = await response.json();
            if (response.status === 200) {
                data = _data.data;
                if (_data.err_code === '00') {
                    let id_admin = data.id_operator;
                    let name = data.name;
                    let tgl = new Date();
                    const _token = id_admin + 'Þ' + name + 'Þ' + tgl;
                    token = CryptoJS.AES.encrypt(_token, secretKey).toString();
                    localStorage.setItem(tokenLogin, token);
                    return data;
                } else {
                    return thunkAPI.rejectWithValue(_data);
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

export const fetchUserBytoken = createAsyncThunk(
    'users/fetchUserByToken',
    async (prm, thunkAPI) => {
        const token = localStorage.getItem(tokenLogin) ? localStorage.getItem(tokenLogin) : "";
        var diffMinutes = 0;
        var id_admin = 0;
        var cms = 0;
        console.log('fetchUserBytoken');
        console.log(token);
        if (token !== "") {
            const dt = CryptoJS.AES.decrypt(token, secretKey);
            const dt_res = dt.toString(CryptoJS.enc.Utf8);
            const _dt = dt_res.split('Þ');
            let tgl_expired = moment(new Date(_dt[2]), 'DD-MM-YYYY HH:mm', true).format();
            let tgl_now = moment(new Date(), 'DD-MM-YYYY HH:mm', true).format();
            diffMinutes = moment(tgl_now).diff(moment(tgl_expired), 'minutes');
            if (diffMinutes < 120) {
                id_admin = _dt[0];
                cms = 1;
            }
        }


        try {
            const response = await fetch(
                API_URL + '/admin_detail',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "id_admin": id_admin,
                        "cms": cms,
                    }),
                }
            );
            let token = '';
            let data = '';
            let _data = await response.json();
            if (response.status === 200) {
                data = _data.data;
                if (_data.err_code === '00') {
                    let id_admin = data.id_operator;
                    let name = data.name;
                    let tgl = new Date();
                    const _token = id_admin + 'Þ' + name + 'Þ' + tgl;
                    token = CryptoJS.AES.encrypt(_token, secretKey).toString();
                    localStorage.setItem(tokenLogin, token);
                    return {...data};
                } else {
                    return thunkAPI.rejectWithValue(_data);
                }
            } else {
                return thunkAPI.rejectWithValue(_data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);


const initialState = {
    expandMenu: true,
    isLoggedIn: !!localStorage.getItem(tokenLogin),
    token: localStorage.getItem(tokenLogin),
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    defaultOpenKeys: '/',
    currentUser: {
        id_operator: null,
        name: '',
        password: null
    }
};

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        clickExpand: (state) => {
            state.expandMenu = !state.expandMenu ? true : false;
            return state;
        },
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;
            state.errorMessage = null;
            return state;
        },
        onLogout: (state) => {
            localStorage.removeItem(tokenLogin);
            state.isLoggedIn = false;
            state.token = null;
            state.currentUser = initialState.currentUser;
            return state;
        },
        setDefaultOpenKeys: (state, dt) => {
            state.defaultOpenKeys = dt.payload;
        }
    },
    extraReducers: {
        [loginUser.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.isLoggedIn = !!localStorage.getItem(tokenLogin);
            state.token = localStorage.getItem(tokenLogin);
            state.currentUser = payload;
            return state;
        },
        [loginUser.rejected]: (state, {payload}) => {
            //console.log('payload', payload);
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.err_msg;
        },
        [loginUser.pending]: (state) => {
            state.isFetching = true;
        },
        [fetchUserBytoken.pending]: (state) => {
            state.isFetching = true;
        },
        [fetchUserBytoken.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.currentUser = payload;
        },
        [fetchUserBytoken.rejected]: (state) => {

            state.isFetching = false;
            state.isError = true;
        },
    }
})

export const {clickExpand, clearState, onLogout, setDefaultOpenKeys} = mainSlice.actions;
export const userSelector = (state) => state.main;
//export default mainSlice.reducer;