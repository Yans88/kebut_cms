import React, {Component, Fragment} from 'react'
import {Breadcrumb, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {addData, addForm, clearError, closeForm, confirmDel, deleteData, fetchData} from './citySlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import {AppSwalSuccess} from '../../components/modal/SwalSuccess';

class City extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_kota: '',
            nama_city: '',
            kode_city: '',
            id_operator: '',
            id_provinsi: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "nama_city",
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
        sessionStorage.removeItem('idCityKebut');
        sessionStorage.removeItem('idKecKebut');
        const selectedId = sessionStorage.getItem('idProvKebut');
        this.setState({
            id_provinsi: selectedId,
            selected: {
                ...this.state.selected,
                id_provinsi: selectedId
            }
        });
        const queryString = {...this.state, id_provinsi: selectedId}
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
        const {name, value} = event.target
        this.setState({
            loadingForm: false,
            selected: {
                ...this.state.selected,
                [name]: value
            }
        });
        this.setState({errMsg: this.initSelected});
        this.props.resetError();
        if (!this.state.selected.id_operator) this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });
    }

    discardChanges = () => {
        this.setState({errMsg: {}, selected: this.initSelected, loadingForm: false});
        if (!this.state.selected.id_operator) this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });
        this.props.showForm();
    }

    editRecord = (record) => {
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: {...record, id_operator: this.props.user.id_operator}
        });
        this.props.showForm(true);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: {...record, id_operator: this.props.user.id_operator}
        });
        this.props.showConfirmDel(true);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.kode_city = !this.state.selected.kode_city ? "Required" : '';
        errors.nama_city = !this.state.selected.nama_city ? "Required" : '';
        if (!this.state.selected.id_operator) this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });

        this.setState({errors});
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

    ListKec = async (record) => {
        await sessionStorage.setItem('idCityKebut', record.id_kota);
        this.props.history.push("/kecamatan");
    }

    render() {
        const getBasename = path => path.substr(0, path.lastIndexOf('/'));
        const {data, provinsiName} = this.props;
        const {selected, errMsg} = this.state;
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
                key: "kode_city",
                text: "Kode",
                align: "center",
                width: 150,
                sortable: true,

            },
            {
                key: "nama_city",
                text: "Kab/Kota",
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
                        <div style={{textAlign: "center"}}>
                            <Fragment>
                                <button
                                    className="btn btn-info btn-xs"
                                    onClick={(e) => this.ListKec(record)}
                                    style={{marginRight: '5px'}}>
                                    <i className="fa fa-list"></i> List Kecamatan
                                </button>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.editRecord(record)}
                                    style={{marginRight: '5px'}}>
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
            key_column: 'id_kota',
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
            <Form.Group controlId="kode_city">
                <Form.Label>Kode</Form.Label>

                {errMsg.kode_city ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.kode_city}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="kode_city"
                    type="text"
                    value={selected.kode_city ? selected.kode_city : ''}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Kode"/>
            </Form.Group>
            <Form.Group controlId="nama_city">
                <Form.Label>Kab/Kota</Form.Label>
                {errMsg.nama_city ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.nama_city}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="nama_city"
                    type="text"
                    value={selected.nama_city}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Kab/Kota"/>
            </Form.Group>
        </Form>;

        const contentDelete = <div
            dangerouslySetInnerHTML={{__html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>'}}/>;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Kab/Kota</h1>
                            </div>
                            {/* /.col */}

                            {provinsiName ? (
                                <div className="col-sm-6">

                                    <Breadcrumb className="float-right">
                                        <Breadcrumb.Item
                                            href={getBasename(window.location.pathname) + "/provinsi"}>Provinsi</Breadcrumb.Item>

                                        <Breadcrumb.Item active>{provinsiName}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>) : ''}

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
                    title="Delete Kab/Kota"
                    titleButton="Delete"
                    themeButton="danger"
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handleDelete.bind(this)}
                ></AppModal>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{__html: this.props.contentMsg}}/>}
                    type={this.props.tipeSWAL}
                    handleClose={this.props.isError ? this.props.closeSwalError : this.handleCloseSwal.bind(this)}
                >
                </AppSwalSuccess>) : ''}
            </div>


        )
    }
}

const mapStateToProps = (state) => ({
    data: state.city.data || [],
    totalData: state.city.totalData,
    provinsiName: state.city.provinsi_name,
    isError: state.city.isError,
    isLoading: state.city.isLoading,
    isAddLoading: state.city.isAddLoading,
    showFormAdd: state.city.showFormAdd,
    errorPriority: state.city.errorPriority || null,
    contentMsg: state.city.contentMsg || null,
    showFormSuccess: state.city.showFormSuccess,
    showFormDelete: state.city.showFormDelete,
    tipeSWAL: state.city.tipeSWAL,
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
export default connect(mapStateToProps, mapDispatchToPros)(City);