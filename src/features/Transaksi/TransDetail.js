import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {assignDriver, closeForm, fetchDataDetail, setDriver} from './transaksiSlice'
import NumberFormat from 'react-number-format';
import moment from 'moment';
import "moment/locale/id";
import {Placeholder} from 'rsuite';
import {Form} from 'react-bootstrap';
import AppModal from '../../components/modal/MyModal';
import {SelectData} from '../../components/modal/MySelect';
import axios from 'axios';
import {AppSwalSuccess} from '../../components/modal/SwalSuccess';

class TransDetail extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            operator_by: '',
            id_driver: '',
            id_operator: '',
            deviceID: '',
        }
        this.state = {
            isLoading: false,
            showSwalSuccess: false,
            errMsg: this.initSelected,
            id_operator: '',
            id_driver: '',
            driver_name: '',
            deviceID: '',
            id_transaksi: sessionStorage.getItem('idTransKuu'),
            selectOptions: null,
            isLoadingSelected: false
        }
        this.onchangeSelect = this.onchangeSelect.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({...this.state, id_operator: this.props.user.id_operator});
        const selectedIdCNI = sessionStorage.getItem('idTransKuu');
        const queryString = {id_transaksi: selectedIdCNI}
        this.props.onLoad(queryString);
    };

    handleSubmit() {
        var errors = this.state.errMsg;
        errors.id_driver = !this.state.id_driver ? "Driver required" : '';
        errors.deviceID = !this.state.deviceID ? "Device ID required" : '';
        this.setState({errors});
        if (this.validateForm(this.state.errMsg)) {
            this.props.assignDrivers(this.state);
        } else {
            console.error('Invalid Form')
        }
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    confirmDriver = () => {
        const param = {showFormDriver: true}
        this.getOptions();
        this.props.onSetDriver(param);
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            id_driver: '',
            deviceID: '',
            errMsg: {
                id_driver: '',
                deviceID: ''
            }
        })
        const param = {showFormDriver: false}
        this.props.onSetDriver(param);
    };

    handleChange(event) {
        const {name, value} = event.target
        var val = value;
        this.setState({
            ...this.state,
            [name]: val
        });
        if (!this.state.id_operator) this.setState({...this.state, id_operator: this.props.user.id_operator});
    }

    async onchangeSelect(evt) {
        await this.setState({...this.state, id_driver: evt.value, driver_name: evt.label})
        if (!this.state.id_operator) this.setState({...this.state, id_operator: this.props.user.id_operator});
    };

    closeSwal = () => {
        this.props.closeSwal();
        this.getData();
    }

    async getOptions() {
        this.setState({isLoadingSelected: true, id_driver: '', driver_name: ''})
        const param = {is_wh: 1}
        const url = process.env.REACT_APP_URL_API + "/drivers"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_driver,
                "label": d.name
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: options,
                    isLoadingSelected: false

                })
            }, 400);
        } else {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: null,
                    isLoadingSelected: true

                })
            }, 400);

        }
    }

    render() {
        const {dtRes} = this.props;
        const {Paragraph} = Placeholder;
        const {errMsg} = this.state;

        const frmUser = <Form id="myForm" style={{height: 180}}>

            <Form.Group controlId="id_driver">
                <Form.Label>Driver</Form.Label>
                {this.props.errorPriority ? (
                    <span className="float-right text-error badge badge-danger">{this.props.errorPriority}
                </span>) : ''}
                {errMsg.id_driver ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.id_driver}
                    </span>) : ''}
                <SelectData
                    myVal={this.state.id_driver ? ({value: this.state.id_driver, label: this.state.driver_name}) : ''}
                    getData={this.state.selectOptions}
                    isLoading={this.state.isLoadingSelected}
                    onChange={this.onchangeSelect}
                />
            </Form.Group>

            <Form.Group controlId="category_name">
                <Form.Label>Device ID</Form.Label>
                {errMsg.deviceID ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.deviceID}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="deviceID"
                    type="text"
                    value={this.state.deviceID}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Device ID"/>
            </Form.Group>

        </Form>;
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Transaksi Detail</h1>
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
                                        <table className="table table-condensed">

                                            <tbody>
                                            <tr>
                                                <td style={{
                                                    "backgroundColor": "rgba(0,0,0,.1)",
                                                    "fontWeight": "bold",
                                                    "fontSize": "16px"
                                                }} colSpan="9" align="center">
                                                    Information
                                                </td>
                                            </tr>
                                            {this.props.isLoading ? (
                                                <Fragment>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <tr>
                                                        <td width="15%"><strong>Order ID</strong></td>
                                                        <td width="1%"><strong>:</strong></td>
                                                        <td width="20%">{dtRes.id_transaksi}</td>
                                                        <td width="8%"><strong>Name</strong></td>
                                                        <td width="1%"><strong>:</strong></td>
                                                        <td width="25%">{dtRes.nama_member}</td>
                                                        <td width="12%"><strong>Pengiriman</strong></td>
                                                        <td width="1%"><strong>:</strong></td>
                                                        <td width="20%">{dtRes.nama_cargo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Status</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td><Fragment>
                                                            {dtRes.status === 1 && <span className="badge bg-warning">Waiting Payment</span>}
                                                            {dtRes.status === 2 &&
                                                                <span className="badge bg-info">Cancel Payment</span>}
                                                            {dtRes.status === 3 &&
                                                                <span className="badge bg-warning">Waiting Approve Payment</span>}
                                                            {dtRes.status === 4 && <span className="badge bg-success">Payment Complete</span>}
                                                        </Fragment>
                                                        </td>
                                                        <td><strong>Email</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.email}</td>
                                                        <td><strong>Order Date</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.created_at ? moment(new Date(dtRes.created_at)).format('DD MMMM YYYY HH:mm') : '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Driver</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.nama_driver ? dtRes.nama_driver : '-'}</td>
                                                        <td><strong>Phone</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.phone_member}</td>
                                                        <td><strong>Payment Date</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.payment_date ? moment(new Date(dtRes.payment_date)).format('DD MMMM YYYY HH:mm') : '-'}</td>
                                                    </tr>

                                                    <tr>
                                                        <td><strong>Phone Driver</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.driver_phone ? dtRes.driver_phone : '-'}</td>
                                                        <td><strong>Provinsi</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.provinsi_pickup ? dtRes.provinsi_pickup : '-'}</td>
                                                        <td><strong>Pickup Date</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td>{dtRes.tgl_barang_diambil ? moment(new Date(dtRes.tgl_barang_diambil)).format('DD MMMM YYYY HH:mm') : '-'}</td>

                                                    </tr>


                                                    <tr>
                                                        <td><strong>Alamat Penjemputan Paket</strong></td>
                                                        <td><strong>:</strong></td>
                                                        <td colSpan="7">{dtRes.lokasi_pickup ? dtRes.lokasi_pickup : '-'}{dtRes.phone_member ? ', ' + dtRes.phone_member : ''}{'.(' + dtRes.latitude_pickup + ',' + dtRes.longitude_pickup + ')'}</td>
                                                    </tr>
                                                </Fragment>
                                            )}
                                            <tr>
                                                <td style={{
                                                    "backgroundColor": "rgba(0,0,0,.08)",
                                                    "fontWeight": "bold",
                                                    "fontSize": "16px"
                                                }} colSpan="9" align="center">List Pengantaran Paket
                                                </td>
                                            </tr>

                                            </tbody>
                                        </table>
                                        <br/>
                                        <table className="table table-bordered"
                                               style={{borderBottom: "none", borderLeft: "none"}}>
                                            <thead>
                                            <tr>
                                                <th style={{width: 40, textAlign: 'center'}}>No.</th>
                                                <th style={{width: 200, textAlign: 'center'}}>Tujuan</th>
                                                <th style={{width: 150, textAlign: 'center'}}>Deskripsi Barang</th>
                                                <th style={{width: 150, textAlign: 'center'}}>Harga Barang</th>
                                                <th style={{width: 120, textAlign: 'center'}}>Asuransi</th>
                                                <th style={{width: 200, textAlign: 'center'}}>Bongkar Muat</th>
                                                <th style={{"textAlign": "center", width: 100}}>Asuransi + Bongkar Muat</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.props.isLoading ? (
                                                <Fragment>
                                                    <tr>
                                                        <td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1}
                                                                                   active/></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{border: "none"}} colSpan="5"></td>
                                                        <td style={{border: "none"}} colSpan="2" align="right">
                                                            <Paragraph rowHeight={20} rowMargin={7} rows={1} active/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{border: "none"}} colSpan="5"></td>
                                                        <td style={{border: "none"}} colSpan="2" align="right">
                                                            <Paragraph rowHeight={20} rowMargin={7} rows={1} active/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{border: "none"}} colSpan="5"></td>
                                                        <td style={{border: "none"}} colSpan="2" align="right">
                                                            <Paragraph rowHeight={20} rowMargin={7} rows={1} active/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{border: "none"}} colSpan="5"></td>
                                                        <td style={{border: "none"}} colSpan="2" align="right">
                                                            <Paragraph rowHeight={20} rowMargin={7} rows={1} active/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{border: "none"}} colSpan="5"></td>
                                                        <td style={{border: "none"}} colSpan="2" align="right">
                                                            <Paragraph rowHeight={20} rowMargin={7} rows={1} active/>
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    {dtRes.list_pesanan ? dtRes.list_pesanan.map((dt, i) => (

                                                            <tr key={i}>
                                                                <td align="center">{i + 1}.</td>
                                                                {dt.status === 1 ? (
                                                                    <td>{dt.nama_penerima + ' - ' + dt.hp_penerima}<br/>{dt.alamat_kirim + '. (' + dt.latitude_destination + ',' + dt.longitude_destination + ')'}<br/><span
                                                                        className="badge bg-info">Received date :{moment(new Date(dt.tgl_barang_diserahkan)).format('DD MMMM YYYY HH:mm')}</span>
                                                                    </td>) : (
                                                                    <td>{dt.nama_penerima + ' - ' + dt.hp_penerima}<br/>{dt.alamat_kirim + '. (' + dt.latitude_destination + ',' + dt.longitude_destination + ')'}
                                                                    </td>)}

                                                                <td>{dt.deskripsi_barang}</td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.hrg}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>

                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.nominal_biaya_asuransi}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>

                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.biaya_tambahan_bm}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={Number(dt.nominal_biaya_asuransi) + Number(dt.biaya_tambahan_bm)}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                            </tr>

                                                        ))

                                                        : (<tr>
                                                            <td colSpan="7">Data not found</td>
                                                        </tr>)}
                                                    <tr>
                                                        <td align="right" colSpan="6" style={{border: "none"}}><strong>
                                                            Biaya Pengiriman</strong></td>
                                                        <td align="right">
                                                            <NumberFormat
                                                                value={Number(dtRes.ttl_biaya) - Number(dtRes.kode_unik_transfer) - Number(dtRes.ttl_biaya_asuransi) + Number(dtRes.ttl_biaya_bm)}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                displayType={'text'}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" colSpan="6" style={{border: "none"}}><strong>Kode Unik Transfer</strong></td>
                                                        <td align="right">
                                                            <NumberFormat
                                                                value={dtRes.kode_unik_transfer}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                displayType={'text'}
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td align="right" colSpan="6"
                                                            style={{border: "none", color: "red"}}>
                                                            <strong>Potongan Voucher</strong>
                                                        </td>
                                                        <td align="right" style={{color: "red"}}>
                                                            <NumberFormat
                                                                value={dtRes.potongan_voucher}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                displayType={'text'}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" colSpan="6" style={{border: "none"}}>
                                                            <strong>Total</strong>
                                                        </td>
                                                        <td align="right"
                                                            style={{"backgroundColor": "rgba(0,0,0,.04)"}}>
                                                            <strong>
                                                                <NumberFormat
                                                                    value={dtRes.ttl_biaya}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </strong>
                                                        </td>

                                                    </tr>
                                                </Fragment>
                                            )}

                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <AppModal
                    show={this.props.showFormDriver}
                    form={frmUser}
                    size="xs"
                    backdrop={false}
                    keyboard={false}
                    title="Set Driver"
                    titleButton="Set Driver"
                    themeButton="success"
                    handleClose={this.handleClose}
                    isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.isLoadingSelected}
                    formSubmit={this.handleSubmit.bind(this)}
                ></AppModal>

                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={this.props.successMsg}
                    type="success"
                    handleClose={this.closeSwal}/>) : ''}

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dtRes: state.transaksi.dtRes || [],
    showFormDriver: state.transaksi.showFormDriver,
    isError: state.transaksi.isError,
    isLoading: state.transaksi.isLoading,
    isAddLoading: state.transaksi.isAddLoading,
    contentMsg: state.transaksi.contentMsg || null,
    showFormSuccess: state.transaksi.showFormSuccess,
    tipeSWAL: state.transaksi.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchDataDetail(param));
        },
        onSetDriver: (param) => {
            dispatch(setDriver(param));
        },
        assignDrivers: (param) => {
            dispatch(assignDriver(param));
        },
        closeSwal: () => {
            dispatch(closeForm());

        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(TransDetail);