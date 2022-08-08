import React, { Component } from 'react'
import { Dropdown, Header, Icon, Nav, Navbar } from 'rsuite'
import { connect } from 'react-redux';
import { clickExpand, onLogout, setDefaultOpenKeys, fetchUserBytoken } from '../features/main/mainSlice'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import "moment/locale/id";

const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

class MyHeader extends Component {

    componentDidMount() {
        this.fetchProfileAdmin();
    }

    fetchProfileAdmin = () => {
        const token = localStorage.getItem(tokenLogin);
        var diffMinutes = 400;
		console.log('header/fetchProfileAdmin');
		console.log(token);
        if(token){
            const dt = CryptoJS.AES.decrypt(token, secretKey);
            const dt_res = dt.toString(CryptoJS.enc.Utf8);
            const _dt = dt_res.split('Þ');
            let tgl_expired = moment(new Date(_dt[2]), 'DD-MM-YYYY HH:mm', true).format();
            let tgl_now = moment(new Date(), 'DD-MM-YYYY HH:mm', true).format();
            diffMinutes = moment(tgl_now).diff(moment(tgl_expired), 'minutes');
        }
        if (diffMinutes < 120) {

        } else {
            this.props.logOut();
            <Redirect to="/login" />
        }

    }

    handleToggle() {
        this.props.onClickExpand();
    }
    handleLogout() {
        this.props.logOut();
        <Redirect to="/login" />
    }
    render() {

        return (

            <Header>
                <Navbar appearance="inverse" className="my-navbar1">
                    <Navbar.Header>
                        <Link to='/' className="navbar-brand logo"><b>Kebut Express</b></Link>
                    </Navbar.Header>
                    <Navbar.Body>
                        <Nav>
                            <Nav.Item icon={<Icon icon="bars" />} onClick={this.handleToggle.bind(this)} className="drawwer"></Nav.Item>
                        </Nav>

                        <Nav pullRight>

                            <Dropdown className="show dr-logout" icon={<Icon icon="user-o" size="lg" />} title={this.props.user.name ? (this.props.user.name) : ("Account")}>
                                <Dropdown.Item onClick={this.handleLogout.bind(this)} className="dropdown-menuu" icon={<Icon icon="sign-out" />}>Logout</Dropdown.Item>

                            </Dropdown>
                        </Nav>

                    </Navbar.Body>
                </Navbar>

            </Header>


        )
    }
}
const mapDispatchToPros = (dispatch) => {
    return {
        onClickExpand: () => {
            dispatch(clickExpand());
        },
        logOut: () => {
            dispatch(onLogout());
        },
        onLoad: (dt) => {
            dispatch(fetchUserBytoken());
            dispatch(setDefaultOpenKeys(dt));
        }
    }
}
const mapStateToProps = (state) => ({
    user: state.main.currentUser
});
export default connect(mapStateToProps, mapDispatchToPros)(MyHeader);