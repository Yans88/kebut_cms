import React, { Component, Fragment } from 'react'
import { Breadcrumb, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, addForm, addData, clearError, confirmDel, closeForm, deleteData } from './kecSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

class Kec extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_kota: '',
            id_kec: '',
            nama_kec: '',
            kode_kec: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "nama_kec",
            keyword: '',
            page_number: 1,
            per_page: 10,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
            id_provinsi: '',
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        sessionStorage.removeItem('idKecKebut');
        const selectedId = sessionStorage.getItem('idCityKebut');
        this.setState({
            id_city: selectedId,
            selected: {
                ...this.state.selected,
                id_city: selectedId
            }
        });
        const queryString = { ...this.state, id_city: selectedId }
        this.props.onLoad(queryString);
    };

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

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            loadingForm: false,
            selected: {
                ...this.state.selected,
                [name]: value
            }
        });
        this.setState({ errMsg: this.initSelected });
        this.props.resetError();
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.props.showForm();
    }

    editRecord = (record) => {
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showForm(true);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.kode_kec = !this.state.selected.kode_kec ? "Required" : '';
        errors.nama_kec = !this.state.selected.nama_kec ? "Required" : '';
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });

        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state.selected);
        } else {
            console.error('Invalid Form')
        }
    }

    handleCloseSwal() {
        this.props.closeSwal(this.state);
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    ListKel = async (record) => {
        await sessionStorage.setItem('idKecKebut', record.id_kec);
        this.props.history.push("/kelurahan");
    }

    render() {
        const getBasename = path => path.substr(0, path.lastIndexOf('/'));
        const { data, provinsiName, cityName } = this.props;
        const { selected, errMsg } = this.state;
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
                key: "kode_kec",
                text: "Kode",
                align: "center",
                width: 150,
                sortable: true,

            },
            {
                key: "nama_kec",
                text: "Kecamatan",
                align: "center",
                sortable: true,

            },
            {
                key: "action",
                text: "Action",
                width: 250,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-info btn-xs"
                                    onClick={(e) => this.ListKel(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-list"></i> List Kelurahan
                                </button>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.editRecord(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}>
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_kec',
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
        const frmUser = <Form id="myForm">
            <Form.Group controlId="kode_kec">
                <Form.Label>Kode</Form.Label>

                {errMsg.kode_kec ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.kode_kec}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="kode_kec"
                    type="text"
                    value={selected.kode_kec ? selected.kode_kec : ''}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Kode" />
            </Form.Group>
            <Form.Group controlId="nama_kec">
                <Form.Label>Kecamatan</Form.Label>
                {errMsg.nama_kec ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.nama_kec}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="nama_kec"
                    type="text"
                    value={selected.nama_kec}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Kecamatan" />
            </Form.Group>
        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Kecamatan</h1>
                            </div>{/* /.col */}
                            {provinsiName ? (
                                <div className="col-sm-6">
                                    <Breadcrumb className="float-right">
                                        <Breadcrumb.Item href={getBasename(window.location.pathname) + "/provinsi"}>Provinsi</Breadcrumb.Item>
                                        <Breadcrumb.Item href={getBasename(window.location.pathname) + "/city"}>{provinsiName}</Breadcrumb.Item>
                                        <Breadcrumb.Item active>{cityName}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>) : ''}

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
                    show={this.props.showFormAdd}
                    form={frmUser}
                    size="xs"
                    backdrop={false}
                    keyboard={false}
                    title="Add/Edit"
                    titleButton="Save change"
                    themeButton="success"
                    handleClose={this.handleClose}
                    isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.loadingForm}
                    formSubmit={this.handleSubmit.bind(this)}
                ></AppModal>
                <AppModal
                    show={this.props.showFormDelete}
                    size="xs"
                    form={contentDelete}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Kecamatan"
                    titleButton="Delete"
                    themeButton="danger"
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handleDelete.bind(this)}
                ></AppModal>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{ __html: this.props.contentMsg }} />}
                    type={this.props.tipeSWAL}
                    handleClose={this.props.isError ? this.props.closeSwalError : this.handleCloseSwal.bind(this)}
                >
                </AppSwalSuccess>) : ''}
            </div>



        )
    }
}
const mapStateToProps = (state) => ({
    data: state.kecamatan.data || [],
    totalData: state.kecamatan.totalData,
    provinsiName: state.kecamatan.provinsi_name,
    cityName: state.kecamatan.cityName,
    isError: state.kecamatan.isError,
    isLoading: state.kecamatan.isLoading,
    isAddLoading: state.kecamatan.isAddLoading,
    showFormAdd: state.kecamatan.showFormAdd,
    errorPriority: state.kecamatan.errorPriority || null,
    contentMsg: state.kecamatan.contentMsg || null,
    showFormSuccess: state.kecamatan.showFormSuccess,
    showFormDelete: state.kecamatan.showFormDelete,
    tipeSWAL: state.kecamatan.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        showForm: () => {
            dispatch(addForm());
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
        },
        onAdd: (param) => {
            dispatch(addData(param));
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
        closeSwal: (param) => {
            dispatch(closeForm());
            dispatch(fetchData(param));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Kec);