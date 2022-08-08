import React, { Component, Fragment } from 'react'
import { Figure } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, clearError, confirmDel, closeForm, deleteData } from './outletsSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

class Outlets extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_outlet: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "nama_outlet",
            keyword: '',
            page_number: 1,
            per_page: 10,
            is_cms: 1,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idOutletKebut');
        this.props.onLoad(this.state);
    }

    handleClose = () => {
        this.props.closeModal();
        this.setState({
            errMsg: {},
            selected: this.initSelected,
            loadingForm: false
        });
    };

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

    discardChanges = async (record) => {
        if (record) await sessionStorage.setItem('idOutletKebut', record.id_outlet);
        this.props.history.push("add_outlet");
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    render() {
        const { data } = this.props;

        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{ textAlign: "center" }}>{((this.state.page_number - 1) * this.state.per_page) + index + 1 + '.'}</div>,
                row: 0
            },
            {
                key: "nama_outlet",
                text: "Outlet",
                align: "center",
                sortable: true,
                width: 170
            },
            {
                key: "alamat",
                text: "Alamat",
                align: "center",
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        {record.alamat}<br />
                        Koordinat : {record.latitude ? record.latitude : '-'},{record.longitude ? record.longitude : '-'}
                    </Fragment>)
                }
            },
            {
                key: "phone",
                text: "Contact",
                align: "center",
                width: 150,
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        Phone : {record.phone ? record.phone : '-'}<br />
                        Telp. : {record.telp ? record.telp : '-'}
                    </Fragment>)
                }
            },
            {
                key: "img",
                text: "Image",
                align: "center",
                width: 180,
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    alt={record.nama_outlet}
                                    src={record.img}
                                />

                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 90,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.discardChanges(record)}
                                    style={{ marginBottom: '3px', width: 80 }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}
                                    style={{ width: 80 }}>
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </Fragment>

                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_outlet',
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


        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;

        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Outlets</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{ "minHeight": "800px" }}>
                                    <div className="card-header card-header-content">
                                        <AppButton
                                            isLoading={this.props.isLoading}
                                            theme="info"
                                            onClick={this.discardChanges}
                                            icon='add'
                                        >
                                            Add
                                        </AppButton>

                                    </div>
                                    <div className="card-body">
                                        {data ? (
                                            <ReactDatatable
                                                config={config}
                                                records={data}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                loading={this.props.isLoading}
                                                total_record={this.props.totalData}
                                            />
                                        ) : (<p>No Data ...</p>)}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <AppModal
                    show={this.props.showFormDelete}
                    size="xs"
                    form={contentDelete}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Outlet"
                    titleButton="Delete Outlet"
                    themeButton="danger"
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handleDelete.bind(this)}
                ></AppModal>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{ __html: this.props.contentMsg }} />}
                    type={this.props.tipeSWAL}
                    handleClose={this.props.isError ? this.props.closeSwalError : this.props.closeSwal}
                >
                </AppSwalSuccess>) : ''}
            </div>



        )
    }
}
const mapStateToProps = (state) => ({
    data: state.outlets.data || [],
    totalData:state.outlets.totalData,
    isError: state.outlets.isError,
    isLoading:state.outlets.isLoading,
    isAddLoading: state.outlets.isAddLoading,
    errorPriority: state.outlets.errorPriority || null,
    contentMsg: state.outlets.contentMsg || null,
    showFormSuccess: state.outlets.showFormSuccess,
    showFormDelete: state.outlets.showFormDelete,
    tipeSWAL: state.outlets.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
        },
        onDelete: (param) => {
            dispatch(deleteData(param));
        },
        closeModal: () => {
            dispatch(closeForm());
        },
        resetError: () => {
            dispatch(clearError());
        },
        closeSwal: () => {
            dispatch(closeForm());
            const queryString = {
                sort_order: "ASC",
                sort_column: "nama_outlet",
                is_cms: 1,
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Outlets);