import React, { Component } from 'react'
import { Dropdown, Nav, Sidebar, Sidenav, Icon } from 'rsuite';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class MySidebar extends Component {

    constructor(props) {
        super(props);
        this.state = { lastSegmentUrl: "" }
    }

    componentDidMount = async () => {
        const location = window.location.href;
        const BaseName = location.substring(location.lastIndexOf("/") + 1);
        await this.setState({ lastSegmentUrl: BaseName })
    }

    handleMenu = async (dt) => {
        await (this.setState({ lastSegmentUrl: dt }));
    }

    render() {
        const { expandMenu } = this.props.main;
        const { lastSegmentUrl } = this.state;
        return (
            <div>
                <Sidebar
                    style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgb(31, 30, 30)' }}
                    width={expandMenu ? 230 : 56}
                    collapsible
                >
                    <Sidenav
                        className="my-sidebar"
                        expanded={expandMenu}
                        //defaultOpenKeys={[`${defaultOpenKeys}`]}
                        appearance="subtle">
                        <Sidenav.Body>
                            {expandMenu ? (<h5 style={{ textAlign: "center", fontWeight: 600, fontSize: 16 }}>Selamat datang <br />dihalaman Administrator</h5>) :
                                ''}

                            <Nav>
                                <Nav.Item
                                    onSelect={e => this.handleMenu("/")}
                                    componentClass={Link}
                                    to='/'
                                    eventKey='/'
                                    exact='/'
                                    className={lastSegmentUrl === "/" || lastSegmentUrl === "" || lastSegmentUrl === "cooljek" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                    icon={<Icon icon="home" />}>
                                    Home
                                </Nav.Item>

                                <Nav.Item
                                    onSelect={e => this.handleMenu('members')}
                                    componentClass={Link}
                                    to='/members'
                                    exact='/members'
                                    eventKey='/members'
                                    className={lastSegmentUrl === "members" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                    icon={<Icon icon="people-group" />}>
                                    Members
                                </Nav.Item>
								
								<Nav.Item
                                    onSelect={e => this.handleMenu('drivers')}
                                    componentClass={Link}
                                    to='/drivers'
                                    exact='/drivers'
                                    eventKey='/drivers'
                                    className={lastSegmentUrl === "drivers" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                    icon={<Icon icon="people-group" />}>
                                    Drivers
                                </Nav.Item>

                                <Nav.Item
                                    onSelect={e => this.handleMenu('outlets')}
                                    componentClass={Link}
                                    to='/outlets'
                                    exact='/outlets'
                                    eventKey='/outlets'
                                    className={lastSegmentUrl === "outlets" || lastSegmentUrl === "add_outlet" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                    icon={<Icon icon="clone" />}>
                                    Outlets
                                </Nav.Item>
                                <Nav.Item
                                    onSelect={e => this.handleMenu('cargo')}
                                    componentClass={Link}
                                    to='/cargo'
                                    exact='/cargo'
                                    eventKey='/cargo'
                                    className={lastSegmentUrl === "cargo" || lastSegmentUrl === "add_cargo" || lastSegmentUrl === "asuransi" || lastSegmentUrl === "bongkar_muat" || lastSegmentUrl === "biaya_inap" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                    icon={<Icon icon="cube" />}>
                                    Armada Cargo
                                </Nav.Item>


                                <Dropdown
                                    eventKey="4"
                                    trigger="hover"
                                    title="Banners"
                                    icon={<Icon icon="image" />}
                                    placement="rightStart"
                                    className={lastSegmentUrl === "banner" || lastSegmentUrl === "banner_cargo" || lastSegmentUrl === "banner_kurir" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                >
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('banner')}
                                        componentClass={Link}
                                        to='/banner'
                                        exact='/banner'
                                        className={lastSegmentUrl === "banner" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="columns" />}
                                        eventKey="4-1"> Home Page
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('banner_cargo')}
                                        componentClass={Link}
                                        to='/banner_cargo'
                                        exact='/banner_cargo'
                                        className={lastSegmentUrl === "banner_cargo" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="logo-dmp" />}
                                        eventKey="4-2"> Kargo
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('banner_kurir')}
                                        componentClass={Link}
                                        to='/banner_kurir'
                                        exact='/banner_kurir'
                                        className={lastSegmentUrl === "banner_kurir" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="logo-ads" />}
                                        eventKey="4-3"> Kurir
                                    </Dropdown.Item>
                                </Dropdown>

                                <Dropdown
                                    eventKey="5"
                                    trigger="hover"
                                    title="Transaksi"
                                    icon={<Icon icon="shopping-bag" />}
                                    placement="rightStart"
                                    className={lastSegmentUrl === "waiting_payment" || lastSegmentUrl === "payment" || lastSegmentUrl === "onprocess" || lastSegmentUrl === "completed" || lastSegmentUrl === "expired" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                >
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('waiting_payment')}
                                        componentClass={Link}
                                        to='/waiting_payment'
                                        exact='/waiting_payment'
                                        className={lastSegmentUrl === "waiting_payment" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="shopping-basket" />}
                                        eventKey="5-1"> Waiting Payment
                                    </Dropdown.Item>
                                    <Dropdown.Item                                        
                                        onSelect={e => this.handleMenu('payment')}
                                        componentClass={Link}
                                        to='/payment'
                                        exact='/payment'
                                        className={lastSegmentUrl === "payment" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="money" />}
                                        eventKey="5-2"> Payment Completed
                                    </Dropdown.Item>
                                    <Dropdown.Item                                        
                                        onSelect={e => this.handleMenu('onprocess')}
                                        componentClass={Link}
                                        to='/onprocess'
                                        exact='/onprocess'
                                        className={lastSegmentUrl === "onprocess" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="refresh" />}
                                        eventKey="5-3"> On Process
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        disabled
                                        onSelect={e => this.handleMenu('completed')}
                                        componentClass={Link}
                                        to='/completed'
                                        exact='/completed'
                                        className={lastSegmentUrl === "completed" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="check-circle" />}
                                        eventKey="5-4"> Completed
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        disabled
                                        onSelect={e => this.handleMenu('faq_cust')}
                                        componentClass={Link}
                                        to='/expired'
                                        exact='/expired'
                                        className={lastSegmentUrl === "expired" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="recycle" />}
                                        eventKey="4-4"> Expired
                                    </Dropdown.Item>
                                </Dropdown>

                                <Dropdown
                                    eventKey="2"
                                    trigger="hover"
                                    title="FAQ"
                                    icon={<Icon icon="question2" />}
                                    placement="rightStart"
                                    className={lastSegmentUrl === "faq_cust" || lastSegmentUrl === "faq_driver" || lastSegmentUrl === "add_faq" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                >
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('faq_driver')}
                                        componentClass={Link}
                                        to='/faq_driver'
                                        exact='/faq_driver'
                                        className={lastSegmentUrl === "faq_driver" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="address-book" />}
                                        eventKey="2-1"> Driver
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('faq_cust')}
                                        componentClass={Link}
                                        to='/faq_cust'
                                        exact='/faq_cust'
                                        className={lastSegmentUrl === "faq_cust" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="address-book-o" />}
                                        eventKey="2-2"> Member
                                    </Dropdown.Item>
                                </Dropdown>

                                <Dropdown
                                    eventKey="3"
                                    trigger="hover"
                                    title="Master Data"
                                    icon={<Icon icon="list-ul" />}
                                    placement="rightStart"
                                    className={lastSegmentUrl === "setting" || lastSegmentUrl === "users" || lastSegmentUrl === "level" || lastSegmentUrl === "provinsi" || lastSegmentUrl === "city" || lastSegmentUrl === "kecamatan" || lastSegmentUrl === "kelurahan" || lastSegmentUrl === "mapping_area" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                >

                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('provinsi')}
                                        componentClass={Link}
                                        to='/provinsi'
                                        exact='/provinsi'
                                        className={lastSegmentUrl === "provinsi" || lastSegmentUrl === "city" || lastSegmentUrl === "kecamatan" || lastSegmentUrl === "kelurahan" || lastSegmentUrl === "mapping_area" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="map-marker" />}
                                        eventKey="3-4"> Area</Dropdown.Item>

                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('level')}
                                        componentClass={Link}
                                        to='/level'
                                        exact='/level'
                                        className={lastSegmentUrl === "level" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="peoples-map" />} eventKey="3-1"> Level</Dropdown.Item>

                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('users')}
                                        componentClass={Link}
                                        to='/users'
                                        exact='/users'
                                        className={lastSegmentUrl === "users" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="peoples" />}
                                        eventKey="3-2"> Users</Dropdown.Item>
                                    <Dropdown.Item
                                        onSelect={e => this.handleMenu('setting')}
                                        componentClass={Link}
                                        to='/setting'
                                        exact='/setting'
                                        className={lastSegmentUrl === "setting" ? ("my-dropdown my-dropdown-active") : ("my-dropdown")}
                                        icon={<Icon icon="cog" />}
                                        eventKey="3-3"> Setting
                                    </Dropdown.Item>
                                </Dropdown>

                            </Nav>
                        </Sidenav.Body>

                    </Sidenav>

                </Sidebar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main
    }
}

export default connect(mapStateToProps)(MySidebar);