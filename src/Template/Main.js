import React, {Component} from 'react'
import {Container, Content} from 'rsuite'
import {MyHeader, MySidebar} from '../Template';
import moment from 'moment';
import "moment/locale/id";
import {connect} from 'react-redux';
import {fetchUserBytoken, onLogout} from '../features/main/mainSlice'
import {Redirect} from 'react-router';

const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

class Main extends Component {

    componentDidMount() {
        this.fetchProfileAdmin();
    }

    fetchProfileAdmin = () => {
        const token = localStorage.getItem(tokenLogin);
        var diffMinutes = 400;
        console.log('main/fetchProfileAdmin');
        console.log(token);
        if (token) {
            const dt = CryptoJS.AES.decrypt(token, secretKey);
            const dt_res = dt.toString(CryptoJS.enc.Utf8);
            const _dt = dt_res.split('Þ');
            let tgl_expired = moment(new Date(_dt[2]), 'DD-MM-YYYY HH:mm', true).format();
            let tgl_now = moment(new Date(), 'DD-MM-YYYY HH:mm', true).format();
            diffMinutes = moment(tgl_now).diff(moment(tgl_expired), 'minutes');
        }
        if (diffMinutes < 120) {
            this.props.fetchDataAdmin();
        } else {
            this.props.logOut();
            <Redirect to="/login"/>
        }

    }

    render() {
        const {children} = this.props;

        document.getElementById('root').classList.remove('login-page');
        document.getElementById('root').classList.remove('hold-transition');
        document.getElementById('root').classList.add('bg-sidebar');
        document.getElementById('root').className += ' sidebar-mini';
        return (

            <div>
                <div className="show-container">
                    <Container>
                        <MyHeader></MyHeader>
                        <Container>
                            <MySidebar/>
                            <Content>

                                {children}
                            </Content>
                        </Container>

                    </Container>
                </div>
            </div>
        )
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        fetchDataAdmin: (payload) => {
            dispatch(fetchUserBytoken(payload));
        },
        logOut: () => {
            dispatch(onLogout());
        }
    }
}
const mapStateToProps = (state) => ({
    user: state.main.currentUser
});
export default connect(mapStateToProps, mapDispatchToPros)(Main);
