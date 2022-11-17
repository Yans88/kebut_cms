import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {fetchDataDetail} from './driversSlice'
import "moment/locale/id";
import {Placeholder} from 'rsuite';
import {Card, Image} from 'react-bootstrap';
import AppButton from "../../components/button/Button";

class DriverDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            showSwalSuccess: false,
            id_operator: '',
            id_driver: sessionStorage.getItem('idDriverSelected'),
        }

    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({...this.state, id_operator: this.props.user.id_operator});
        const selectedId = sessionStorage.getItem('idDriverSelected');
        const queryString = {id_driver: selectedId}
        this.props.onLoad(queryString);
    };

    render() {
        const {dtRes} = this.props;
        const {Paragraph} = Placeholder;

        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Data Driver</h1>
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
                            <div className="col-3">
                                <div className="card shadow-lg">
                                    <div className="card-body box-profile">
                                        <div className="text-center">
                                            {this.props.isLoading ? (<Placeholder.Graph height={200} active/>) :
                                                <Image height={200} width={200} src={dtRes.img_profile} alt=""/>}
                                        </div>
                                        {this.props.isLoading ? (
                                                <Paragraph className="mb-2" rowHeight={20} rowMargin={7} rows={3}
                                                           active/>
                                            ) :
                                            <Fragment>
                                                <h3 className="profile-username text-center">{dtRes.title} {dtRes.nama}</h3>
                                                <p className="text-muted text-center mb-4">{dtRes.phone}</p>
                                            </Fragment>
                                        }
                                        <ul className="list-group list-group-unbordered mb-3">
                                            {this.props.isLoading ? (
                                                    <Paragraph className="mb-2" rowHeight={20} rowMargin={7} rows={19}
                                                               active/>) :
                                                <Fragment>
                                                    <li className="list-group-item">
                                                        <b>No.KTP</b>
                                                        <div className="float-right">
                                                            {dtRes.no_ktp}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Email</b>
                                                        <div className="float-right">
                                                            {dtRes.email}
                                                        </div>
                                                    </li>

                                                    <li className="list-group-item">
                                                        <b>NPWP</b>
                                                        <div className="float-right">
                                                            {dtRes.no_npwp}

                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>No.Pol - Tahun</b>
                                                        <div className="float-right">
                                                            {dtRes.no_pol} - {dtRes.thn_kendaraan}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Tipe Kendaraan</b>
                                                        <div className="float-right">
                                                            {dtRes.tipe_kendaraan}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Merk Kendaraan</b>
                                                        <div className="float-right">
                                                            {dtRes.merk_kendaraan}
                                                        </div>
                                                    </li>

                                                    <li className="list-group-item">
                                                        <b>Nama Pemilik</b>
                                                        <div className="float-right">
                                                            {dtRes.nama_pemilik_kendaraan}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Bank</b>
                                                        <div className="float-right">
                                                            {dtRes.bank}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>No.Rek</b>
                                                        <div className="float-right">
                                                            {dtRes.no_rek}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Nama Pemilik Rek.</b>
                                                        <div className="float-right">
                                                            {dtRes.nama_rek}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Alamat</b>
                                                        <div className="float-right">
                                                            {dtRes.alamat}
                                                        </div>
                                                    </li>
                                                </Fragment>}
                                        </ul>

                                    </div>
                                </div>
                            </div>
                            <div className="col-9">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{"minHeight": "470px"}}>
                                    <div className="card-body">
                                        {this.props.isLoading ? (
                                                <Paragraph className="mb-2" rowHeight={26} rowMargin={15} rows={20}
                                                           active/>) :
                                            <Fragment>
                                                <div className="row">
                                                    <div className="col-4  mb-2 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_ktp}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">KTP</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className="col-4 mb-2 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_npwp}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">NPWP</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className="col-4 mb-2 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_buku_tabungan}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">Buku
                                                                    Tabungan</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className="col-4 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_sim}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">SIM</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className="col-4 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_stnk}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">STNK</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className="col-4 mt-2">
                                                        <Card>
                                                            <Card.Img variant="top" style={{height: '18rem'}}
                                                                      src={dtRes.img_kendaraan}/>
                                                            <Card.Body>
                                                                <p className="text-muted text-center font-weight-bold">Kendaraan</p>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                </div>
                                                <hr className="border-3 m-0"/>
                                                <div style={{float: "right"}} className="mt-3">

                                                    <AppButton disabled
                                                               className="mr-2"
                                                               isLoading={this.props.isAddLoading}
                                                               type="button"
                                                               theme="danger">
                                                        Reject
                                                    </AppButton>
                                                    <AppButton disabled
                                                               className="mr-2"
                                                               isLoading={this.props.isAddLoading}
                                                               type="button"
                                                               theme="success">
                                                        Approve
                                                    </AppButton>
                                                </div>
                                            </Fragment>}
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
    dtRes: state.transaksi.dtRes || [],
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
        }

    }
}
export default connect(mapStateToProps, mapDispatchToPros)(DriverDetail);