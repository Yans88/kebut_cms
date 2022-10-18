import React, {Component, Fragment} from 'react'
import {Breadcrumb, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {addData, fetchData, setData} from './mappingAreaSlice'
import ReactDatatable from '@ashvin27/react-datatable';

class Mapping extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_kelurahan: '',
            id_kec: '',
            nama_kel: '',
            kode_kel: '',
            kode_pos: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            id_kelurahan: '',
            sort_column: "nama_kel",
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
        const selectedId = sessionStorage.getItem('idKelKebut');
        this.setState({
            id_kelurahan: selectedId,
            selected: {
                ...this.state.selected,
                id_kelurahan: selectedId
            }
        });
        const queryString = {...this.state, id_kelurahan: selectedId}
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

    setStatus = async (record) => {
        const isActive = record.status === 1 ? 0 : 1;
        const dt = this.props.data;
        let _dt = {};
        let dtt = [];

        const param = {
            ...record,
            id_operator: this.props.user.id_operator,
            status: isActive
        }
        this.props.onAdd(param);
        dt.map((x, key) => {
            if (x.id_kel_destination === record.id_kel_destination) {
                _dt = {...x, status: !this.props.isError ? isActive : record.status}
            } else {
                _dt = {...x};
            }
            dtt[key] = _dt;
            return dtt;
        });
        this.props.onSetStatus(dtt);
    }

    render() {
        const getBasename = path => path.substr(0, path.lastIndexOf('/'));
        const {data, provinsiName, cityName, kecName, kelName} = this.props;

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
                key: "kode_kel",
                text: "Kode",
                align: "center",
                width: 150,
                sortable: true,

            },
            {
                key: "nama_kel",
                text: "Kelurahan",
                align: "center",
                sortable: true,

            },
            {
                key: "kode_pos",
                text: "Kode Pos",
                align: "center",
                sortable: true,
                width: 100,
            },
            {
                key: "status",
                text: "Active",
                width: 120,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{textAlign: "center"}}>
                            <Fragment>
                                <Form.Check
                                    id={record.id_kel_destination}
                                    checked={record.status > 0 ? ("checked") : ""}
                                    type="switch"
                                    className="chk_isactive"
                                    custom
                                    onChange={(e) => this.setStatus(record)}
                                />
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_kel_destination',
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
                                <h1 className="m-0">Mapping Kelurahan</h1>
                            </div>
                            {/* /.col */}
                            {provinsiName ? (
                                <div className="col-sm-6">

                                    <Breadcrumb className="float-right">
                                        <Breadcrumb.Item
                                            href={getBasename(window.location.pathname) + "/provinsi"}>Provinsi</Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            href={getBasename(window.location.pathname) + "/city"}>{provinsiName}</Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            href={getBasename(window.location.pathname) + "/kecamatan"}>{cityName}</Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            href={getBasename(window.location.pathname) + "/kelurahan"}>{kecName}</Breadcrumb.Item>
                                        <Breadcrumb.Item active>{kelName}</Breadcrumb.Item>
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
                                    {/*  <div className="card-header card-header-content">
                                       

                                    </div> */}
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


            </div>


        )
    }
}

const mapStateToProps = (state) => ({
    data: state.mappingArea.data || [],
    totalData: state.mappingArea.totalData,
    provinsiName: state.mappingArea.provinsi_name,
    cityName: state.mappingArea.cityName,
    kecName: state.mappingArea.kecName,
    kelName: state.mappingArea.kelName,
    isError: state.mappingArea.isError,
    isLoading: state.mappingArea.isLoading,
    isAddLoading: state.mappingArea.isAddLoading,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        onSetStatus: (param) => {
            dispatch(setData(param));
        },
        onAdd: (param) => {
            dispatch(addData(param));
        },

    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Mapping);