import React, { Component } from 'react'
import { Col, Figure, Form } from 'react-bootstrap'
import { Placeholder } from 'rsuite';
import noImg from '../../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import "react-datetime/css/react-datetime.css";
import { addData, fetchDataDetail, chgProps, closeForm, clearError } from './cargoSlice'
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import AppButton from '../../components/button/Button';


class FormCargo extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            nama_cargo: '',
            golongan_tol: '',
            golongan_ferry: '',
            panjang: '',
            lebar: '',
            tinggi: '',
            kap: '',
            volume: '',
            img: ''
        }
        this.state = {
            addLoading: false,
            img: '',
            imgUpload: noImg,
            errMsg: this.initSelected,
            isLoading: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const selectedId = sessionStorage.getItem('idCargoKebut');
        if (selectedId > 0) {
            this.getData();
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
        const selectedId = sessionStorage.getItem('idCargoKebut');
        const queryString = { id_ac: selectedId }
        this.props.onLoad(queryString);
    };

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        errors.nama_cargo = !this.props.dtRes.nama_cargo ? "Nama Kargo required" : '';
        errors.img = !this.state.img && !this.props.dtRes.img ? "Image required" : '';
        errors.img = !this.state.img && this.state.img.size > 2099200 ? "File size over 2MB" : errors.img;
        errors.golongan_ferry = !this.props.dtRes.golongan_ferry ? "Required" : '';
        errors.golongan_tol = !this.props.dtRes.golongan_tol ? "Required" : '';
        errors.panjang = !this.props.dtRes.panjang ? "Required" : '';
        errors.lebar = !this.props.dtRes.lebar ? "Required" : '';
        errors.tinggi = !this.props.dtRes.tinggi ? "Required" : '';
        errors.volume = !this.props.dtRes.volume ? "Required" : '';
        errors.kap = !this.props.dtRes.kap ? "Required" : '';
        this.setState({ ...this.state, addLoading: true });
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            const param = {
                ...this.props.dtRes,
                'img': this.state.img
            }
            console.log(param);
            this.props.onAdd(param);
        } else {
            console.error('Invalid Form')
        }
        // this.setState({
        //     ...this.state,
        //     loadingForm: false,
        // });
    }

    handleClose() {
        this.props.closeSwal();
        this.props.history.push('/cargo');
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        this.props.changeProps(dt);
        if (evt.target.name === "img") {
            value = evt.target.files[0];
            this.setState({ img: '' })
            if (!value) return;
            if (!value.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ errMsg: { img: "Extension Invalid" } })
                this.setState({ addLoading: true })
                dt['key'] = "imgUpload";
                dt['value'] = '';
                dt['key'] = "img";
                dt['value'] = '';
                this.props.changeProps(dt);
                return;
            }
            if (value.size > 2099200) {
                this.setState({ errMsg: { img: "File size over 2MB" } })
                this.setState({ addLoading: true })
                dt['key'] = "imgUpload";
                dt['value'] = '';
                dt['key'] = "img";
                dt['value'] = '';
                this.props.changeProps(dt);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onloadend = () => {
                dt['key'] = "imgUpload";
                dt['value'] = reader.result;
                this.props.changeProps(dt);
                this.setState({ ...this.state, img: value })
            };
        }

        this.setState({
            ...this.state,
            addLoading: false,
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        })
        dt['key'] = name;
        dt['value'] = value;
        if (evt.target.name === "img") {
            dt['value'] = '';
        }
        this.props.changeProps(dt);
        if (name === 'kode_voucher') {
            this.props.resetError();
        }
        //this.setState({ id_operator: this.props.user.id_operator });

    }


    render() {
        const { dtRes } = this.props;
        console.log(dtRes);
        const { Paragraph } = Placeholder;
        const { errMsg } = this.state;
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Add/Edit Kargo</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" >

                                    <div className="card-body">
                                        {this.props.isLoading ? (<Paragraph rowHeight={25} rowMargin={30} rows={8} active style={{ marginTop: 30 }} />) : (
                                            <Form id="myForm">
                                                <br />
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={8} controlId="nama_cargo">
                                                        <Form.Label>Nama Kargo</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.nama_cargo ? dtRes.nama_cargo : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="nama_cargo"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Nama Kargo" />
                                                        {errMsg.nama_cargo && (<span className="text-error badge badge-danger">{errMsg.nama_cargo}</span>)}
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="golongan_tol">
                                                        <Form.Label>Golongan Toll</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.golongan_tol ? dtRes.golongan_tol : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="golongan_tol"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Golongan Toll" />
                                                        {errMsg.golongan_tol && (<span className="text-error badge badge-danger">{errMsg.golongan_tol}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="golongan_ferry">
                                                        <Form.Label>Golongan Ferry</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.golongan_ferry ? dtRes.golongan_ferry : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="golongan_ferry"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Golongan Ferry" />
                                                        {errMsg.golongan_ferry && (<span className="text-error badge badge-danger">{errMsg.golongan_ferry}</span>)}
                                                    </Form.Group>
                                                </Form.Row>

                                                <br />
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="panjang">
                                                        <Form.Label>Panjang</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.panjang ? dtRes.panjang : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="panjang"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Panjang" />
                                                        {errMsg.panjang && (<span className="text-error badge badge-danger">{errMsg.panjang}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="lebar">
                                                        <Form.Label>Lebar</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.lebar ? dtRes.lebar : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="lebar"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Lebar" />
                                                        {errMsg.lebar && (<span className="text-error badge badge-danger">{errMsg.lebar}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="tinggi">
                                                        <Form.Label>Tinggi</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.tinggi ? dtRes.tinggi : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="tinggi"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Tinggi" />
                                                        {errMsg.tinggi && (<span className="text-error badge badge-danger">{errMsg.tinggi}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="volume">
                                                        <Form.Label>Volume</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.volume ? dtRes.volume : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="volume"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Volume" />
                                                        {errMsg.volume && (<span className="text-error badge badge-danger">{errMsg.volume}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="kap">
                                                        <Form.Label>Kapasitas</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.kap ? dtRes.kap : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="kap"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Kapasitas" />
                                                        {errMsg.kap && (<span className="text-error badge badge-danger">{errMsg.kap}</span>)}
                                                    </Form.Group>
                                                </Form.Row>
                                                <br />

                                                <Form.Row>

                                                    <Form.Group as={Col} xs={2} controlId="img">
                                                        <Form.Label>Image</Form.Label>
                                                        {errMsg.img ? (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : ''}
                                                        <Form.File
                                                            setfieldvalue={this.state.img}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="img"
                                                            style={{ "color": "rgba(0, 0, 0, 0)" }} />
                                                        <Form.Text className="text-muted">
                                                            <em>- Images *.jpg, *.jpeg, *.png <br />- Maks. Size 2MB</em>
                                                        </Form.Text>

                                                    </Form.Group>

                                                    {dtRes.img || dtRes.imgUpload ? (
                                                        <Form.Group as={Col} xs={2} controlId="imagePreview">
                                                            <Form.Label style={{ "color": "rgba(0, 0, 0, 0)" }}>-----</Form.Label>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={130}
                                                                    height={100}
                                                                    alt=""
                                                                    src={dtRes.img ? dtRes.img : dtRes.imgUpload}
                                                                />
                                                            </Figure>
                                                        </Form.Group>
                                                    ) : ''}


                                                </Form.Row>
                                                <br />
                                                
                                                <button style={{ marginRight: 5 }} type="button" onClick={() => this.props.history.goBack()} className="btn btn-danger">Back</button>
                                                <AppButton
                                                    onClick={this.handleSubmit.bind(this)}
                                                    isLoading={this.props.isAddLoading || this.state.addLoading}
                                                    type="button"
                                                    theme="success">
                                                    Simpan
                                                </AppButton>

                                            </Form>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{ __html: this.props.contentMsg }} />}
                    type={this.props.tipeSWAL}
                    handleClose={this.handleClose.bind(this)}
                >
                </AppSwalSuccess>) : ''}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        dtRes: state.cargo.dtRes || [],
        user: state.main.currentUser,
        isLoading: state.cargo.isLoading,
        isError: state.cargo.isError,
        isAddLoading: state.cargo.isAddLoading,
        contentMsg: state.cargo.contentMsg || null,
        showFormSuccess: state.cargo.showFormSuccess,
        tipeSWAL: state.cargo.tipeSWAL,
        errorPriority: state.cargo.errorPriority || null,
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            dispatch(addData(data));
        },
        onLoad: (param) => {
            dispatch(fetchDataDetail(param));
        },
        changeProps: (data) => {
            dispatch(chgProps(data));
        },
        closeSwal: () => {
            dispatch(closeForm());
        },
        resetError: () => {
            dispatch(clearError());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(FormCargo);