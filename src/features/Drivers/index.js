import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {clearError, closeForm, fetchData, setStatus, showConfirm} from './driversSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import {Badge} from 'react-bootstrap';
import {Icon} from 'rsuite';
import AppModal from '../../components/modal/MyModal';
import {AppSwalSuccess} from '../../components/modal/SwalSuccess';

class Drivers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sort_order: "ASC",
            sort_column: "nama",
            keyword: '',
            page_number: 1,
            per_page: 10,
            loadingForm: false,
            id_operator: null
        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idDriverSelected');
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
        this.props.onLoad(this.state);
    }

    tableChangeHandler = (data) => {
        let queryString = this.state;
        Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                queryString.sort_order = data[key].order;
                queryString.sort_column = data[key].column;
            }
            if (key === "page_number") {
                queryString.page_number = data[key];
            }
            if (key === "page_size") {
                queryString.per_page = data[key];
            }
            if (key === "filter_value") {
                queryString.keyword = data[key];
            }
            return true;
        });
        this.props.onLoad(this.state);
    }

    showConfirm = async (record) => {
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
        var dt = {
            id_operator: this.state.id_operator ? this.state.id_operator : this.props.user.id_operator,
            status: record.status === 1 ? 2 : 1,
            id_member: record.id_member,
            showFormConfirm: true,
            contentConfirm: record.status === 1 ? '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/> menonaktifkan member ini ?</div>' : '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/> mengaktifkan member ini ?</div>',
        }
        this.props.onConfirm(dt);
    }

    handleStatus() {
        this.props.updateStatus(this.props.dt);
    }

    handleClose = () => {
        var dt = {
            id_operator: this.state.id_operator ? this.state.id_operator : this.props.user.id_operator,
            status: 0,
            id_member: 0,
            showFormConfirm: false,
            contentConfirm: null,
        }
        this.props.onConfirm(dt);
    };

    rowClickedHandler = async (event, data, rowIndex) => {
        await sessionStorage.setItem('idDriverSelected', data.id_driver);
        this.props.history.push("/driver_detail");
    }

    render() {
        const {data} = this.props;

        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div
                    style={{textAlign: "center"}}>{((this.state.page_number - 1) * this.state.per_page) + index + 1 + '.'}</div>,
                row: 0
            },
            {
                key: "nama",
                text: "Nama",
                align: "center",
                sortable: true
            },

            {
                key: "phone",
                text: "Phone",
                align: "center",
                width: 200,
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            {record.phone} {record.verify_phone === 1 &&
                            <Badge style={{fontWeight: 500, fontSize: "65%"}} variant="success" className="float-right"><Icon
                                style={{color: '#ffffff'}} icon="check-square-o" size="lg"/> Verified</Badge>}
                        </Fragment>)
                }
            },
            {
                key: "email",
                text: "Email",
                align: "center",
                width: 300,
                sortable: true
            },
            {
                key: "action",
                text: "Status",
                width: 120,
                align: "center",
                sortable: false,
                cell: record => {
                    var status = record.status === 1 ? "Active" : "Inactive"
                    return (
                        <div style={{textAlign: "center"}}>
                            <Fragment>
                                {status}
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_driver',
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            },
            language: {
                loading_text: "Please be patient while data loads..."
            }
        }
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Drivers</h1>
                            </div>
                            {/* /.col */}

                        </div>
                        {/* /.row */}
                    </div>
                    {/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{"minHeight": "800px"}}>

                                    <div className="card-body">
                                        {data ? (
                                            <ReactDatatable
                                                className="table table-striped table-hover table-bordered"
                                                config={config}
                                                records={data}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                loading={this.props.isLoading}
                                                total_record={this.props.totalData}
                                                onRowClicked={this.rowClickedHandler}
                                            />
                                        ) : (<p>No Data ...</p>)}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <AppModal
                    show={this.props.dt.showFormConfirm}
                    size="xs"
                    form={<div dangerouslySetInnerHTML={{__html: this.props.dt.contentConfirm}}/>}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Confirm"
                    titleButton={this.props.dt.status === 1 ? "Ya, Aktifkan" : "Ya, Nonaktifkan"}
                    themeButton={this.props.dt.status === 1 ? "success" : "danger"}
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handleStatus.bind(this)}
                ></AppModal>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{__html: this.props.contentMsg}}/>}
                    type={this.props.tipeSWAL}
                    handleClose={this.props.isError ? this.props.closeSwalError : this.props.closeSwal}
                >
                </AppSwalSuccess>) : ''}
            </div>


        )
    }
}

const mapStateToProps = (state) => ({
    dt: state.drivers.dt || {},
    totalData: state.drivers.totalData,
    data: state.drivers.data || [],
    isError: state.drivers.isError,
    isLoading: state.drivers.isLoading,
    isAddLoading: state.drivers.isAddLoading,
    showFormSuccess: state.drivers.showFormSuccess,
    contentMsg: state.drivers.contentMsg || null,
    tipeSWAL: state.drivers.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        updateStatus: (param) => {
            dispatch(setStatus(param));
        },
        onConfirm: (dt) => {
            dispatch(showConfirm(dt));
        },
        resetError: () => {
            dispatch(clearError());
        },
        closeSwal: () => {
            dispatch(closeForm());
            const queryString = {
                sort_order: "ASC",
                sort_column: "nama",
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Drivers);