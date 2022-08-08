import React, { Component, Fragment } from 'react'
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, addData, setData, addForm, closeForm } from './pricelistSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import AppModal from '../../components/modal/MyModal';

class PriceList extends Component {

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
            sort_column: "nama_kel",
            keyword: '',
            page_number: 1,
            per_page: 10,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
            id_ac: '',
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const selectedId = sessionStorage.getItem('idCargoKebut');
        this.setState({
            id_ac: selectedId,
            selected: {
                ...this.state.selected,
                id_ac: selectedId
            }
        });
        const queryString = { ...this.state, id_ac: selectedId }
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
            if (x.id_mapping === record.id_mapping) {
                _dt = { ...x, status: !this.props.isError ? isActive : record.status }
            } else {
                _dt = { ...x };
            }
            dtt[key] = _dt;
            return dtt;
        });
        this.props.onSetStatus(dtt);
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: value
            }
        });

        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    editHrg = async (record) => {
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showForm(true);
    }

    handleSubmit() {
        const dt = this.props.data;
        let _dt = {};
        let dtt = [];
        this.props.onAdd(this.state.selected);
        dt.map((x, key) => {
            if (x.id_mapping === this.state.selected.id_mapping && !this.props.isError) {
                _dt = { ...x, hrg: this.state.selected.hrg }
            } else {
                _dt = { ...x };
            }
            dtt[key] = _dt;
            return dtt;
        });

        this.props.onSetStatus(dtt);
    }

    handleCloseSwal() {
        this.props.closeSwal();
    }

    render() {

        const { data, namaCargo } = this.props;
        const { selected } = this.state;
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
                key: "id_mapping",
                text: "ID Mapping",
                align: "center",
                sortable: true,
                width: 80,
            },
            /* {
                key: "id_pricelist",
                text: "ID Pricelist",
                align: "center",
                sortable: true,
                width: 80,
            }, */
            {
                key: "nama_kel_origin",
                text: "Origin",
                align: "center",
                width: 200,
                sortable: true,
                cell: record => {
                    return record.nama_kel_origin + '(' + record.kode_pos_origin + ')'
                }
            },
            {
                key: "nama_kel_destination",
                text: "Destination",
                align: "center",
                width: 200,
                sortable: true,
                cell: record => {
                    return record.nama_kel_destination + '(' + record.kode_pos_destination + ')'
                }
            },
            {
                key: "hrg",
                text: "Biaya",
                align: "center",
                sortable: true,
                width: 70,
                cell: record => {
                    return (<div style={{ textAlign: "right" }}><Fragment>
                        <Link to="#" onClick={(e) => this.editHrg(record)} className={record.hrg ? "link_pricelist" : "link_pricelist_n"}>
                            {record.hrg ? (
                                <NumberFormat
                                    value={record.hrg}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    displayType={'text'}
                                />
                            ) : <div style={{ color: '#CB4335', fontWeight: 500 }}>Set harga</div>}
                        </Link>
                    </Fragment></div>)
                }
            },
            {
                key: "status",
                text: "Active",
                width: 50,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <Form.Check
                                    id={record.id_mapping}
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
            key_column: 'id_mapping',
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
            <Form.Group controlId="biaya">
                <Form.Label>Biaya</Form.Label>
                <NumberFormat
                    name="hrg"
                    onChange={this.handleChange.bind(this)}
                    className="form-control form-control-sm"
                    value={selected.hrg}
                    thousandSeparator={true}
                    decimalScale={2}
                    inputMode="numeric"
                    required
                    autoComplete="off"
                    placeholder="Biaya" />
            </Form.Group>

        </Form>;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Biaya Kirim {namaCargo}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{ "minHeight": "800px" }}>
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

            </div>



        )
    }
}
const mapStateToProps = (state) => ({
    data: state.pricelists.data || [],
    totalData: state.pricelists.totalData,
    namaCargo: state.pricelists.namaCargo || '',
    isError: state.pricelists.isError,
    isLoading: state.pricelists.isLoading,
    isAddLoading: state.pricelists.isAddLoading,
    showFormAdd: state.pricelists.showFormAdd,
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
            dispatch(closeForm());
        },
        showForm: () => {
            dispatch(addForm());
        },
        closeModal: () => {
            dispatch(closeForm());
        },
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(PriceList);