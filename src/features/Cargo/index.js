import React, { Component, Fragment } from 'react'
import { Figure } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, clearError, confirmDel, closeForm, deleteData } from './cargoSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import { BsHeartFill, BsLayersHalf, BsNewspaper } from "react-icons/bs";

class Cargo extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_ac: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "nama_cargo",
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
        sessionStorage.removeItem('idCargoKebut');
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
        if (record) await sessionStorage.setItem('idCargoKebut', record.id_ac);
        this.props.history.push("add_cargo");
    }

    listAsuransi = async (record) => {
        if (record) await sessionStorage.setItem('idCargoKebut', record.id_ac);
        this.props.history.push("asuransi");
    }

    listBM = async (record) => {
        if (record) await sessionStorage.setItem('idCargoKebut', record.id_ac);
        this.props.history.push("bongkar_muat");
    }

    listBi = async (record) => {
        if (record) await sessionStorage.setItem('idCargoKebut', record.id_ac);
        this.props.history.push("biaya_inap");
    }

    listOngkir = async (record) => {
        if (record) await sessionStorage.setItem('idCargoKebut', record.id_ac);
        this.props.history.push("ongkir");
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
                key: "nama_cargo",
                text: "Kargo",
                align: "center",
                sortable: true,
                width: 170
            },
            {
                key: "panjang",
                text: "Ukuran",
                align: "center",
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        P x L x T : {record.panjang ? record.panjang : '0'} x {record.lebar ? record.lebar : '0'} x {record.tinggi ? record.tinggi : '0'}<br />
                        Volume : {record.volume ? record.volume : '-'}<br />
                        Kapasitas : {record.kap ? record.kap : '-'} Kg<br />
                    </Fragment>)
                }
            },
            {
                key: "golongan_tol",
                text: "Golongan",
                align: "center",
                width: 150,
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        Toll : {record.golongan_tol ? record.golongan_tol : '-'}<br />
                        Ferry : {record.golongan_ferry ? record.golongan_ferry : '-'}
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
                                    className="btn btn-xs btn-info"
                                    onClick={e => this.listOngkir(record)}
                                    style={{ marginBottom: '3px', width: 110 }}>
                                    <BsNewspaper /> Ongkos Kirim
                                </button>
                                <button                                    
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.listBM(record)}
                                    style={{ marginBottom: '3px', width: 110 }}>
                                    <BsLayersHalf /> Bongkar Muat
                                </button>
                                <button                                    
                                    className="btn btn-xs btn-warning"
                                    onClick={e => this.listBi(record)}
                                    style={{ marginBottom: '3px', width: 110 }}>
                                    <BsHeartFill /> Biaya Inap
                                </button>
                                <button
                                    className="btn btn-xs btn-info"
                                    onClick={e => this.listAsuransi(record)}
                                    style={{ marginBottom: '3px', width: 110 }}>
                                    <BsHeartFill /> Asuransi
                                </button>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.discardChanges(record)}
                                    style={{ marginRight: '2px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}
                                >
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </Fragment>

                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_ac',
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
                                <h1 className="m-0">Kargo</h1>
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
                    title="Delete Kargo"
                    titleButton="Delete Kargo"
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
    data: state.cargo.data || [],
    totalData:state.cargo.totalData,
    isError: state.cargo.isError,
    isAddLoading: state.cargo.isAddLoading,
    isLoading: state.cargo.isLoading,
    errorPriority: state.cargo.errorPriority || null,
    contentMsg: state.cargo.contentMsg || null,
    showFormSuccess: state.cargo.showFormSuccess,
    showFormDelete: state.cargo.showFormDelete,
    tipeSWAL: state.cargo.tipeSWAL,
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
                sort_column: "nama_cargo",
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
export default connect(mapStateToProps, mapDispatchToPros)(Cargo);