import React, { Component } from 'react'
import { Col, Figure, Form } from 'react-bootstrap'
import { Placeholder } from 'rsuite';
import noImg from '../../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import "react-datetime/css/react-datetime.css";
import { addData, fetchDataDetail, chgProps, closeForm, clearError } from './outletsSlice'
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import AppButton from '../../components/button/Button';


class FormOutlet extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            nama_outlet: '',
            img: '',
            alamat:''
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
        const selectedId = sessionStorage.getItem('idOutletKebut');
        if (selectedId > 0) {
            this.getData();
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
        const selectedId = sessionStorage.getItem('idOutletKebut');
        const queryString = { id_outlet: selectedId }
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
        errors.nama_outlet = !this.props.dtRes.nama_outlet ? "Nama Outlet required" : '';
        errors.img = !this.state.img && !this.props.dtRes.img ? "Image required" : '';
        errors.img = !this.state.img && this.state.img.size > 2099200 ? "File size over 2MB" : errors.img;
        errors.alamat = !this.props.dtRes.alamat ? "Alamat Required" : '';
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
        this.props.history.push('/outlets');
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        const dt = { key: "id_operator", value: this.props.user.id_operator };

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
        const { Paragraph } = Placeholder;
        const { errMsg } = this.state;
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Add/Edit Outlet</h1>
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
                                                    <Form.Group as={Col} xs={4} controlId="nama_outlet">
                                                        <Form.Label>Nama Outlet</Form.Label>

                                                        <Form.Control
                                                            value={dtRes.nama_outlet ? dtRes.nama_outlet : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="nama_outlet"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Nama Outlet" />
                                                        {errMsg.nama_outlet && (<span className="text-error badge badge-danger">{errMsg.nama_outlet}</span>)}

                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="telp">
                                                        <Form.Label>Telp.</Form.Label>

                                                        <Form.Control
                                                            value={dtRes.telp ? dtRes.telp : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="telp"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Telp." />

                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="phone">
                                                        <Form.Label>Phone</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.phone ? dtRes.phone : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="phone"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Phone" />

                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="latitude">
                                                        <Form.Label>Latitude</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.latitude ? dtRes.latitude : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="latitude"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Latitude" />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="longitude">
                                                        <Form.Label>Longitude</Form.Label>
                                                        <Form.Control
                                                            value={dtRes.longitude ? dtRes.longitude : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="longitude"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Longitude" />
                                                    </Form.Group>
                                                </Form.Row>

                                                <br />

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={8} controlId="alamat">
                                                        <Form.Label>Alamat</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            placeholder="Alamat"
                                                            name="alamat"
                                                            value={dtRes.alamat ? dtRes.alamat : ''}
                                                            onChange={this.handleChange}
                                                            style={{ height: '200px' }}
                                                        />
                                                        {errMsg.alamat && (<span className="float-right text-error badge badge-danger">{errMsg.alamat}</span>)}

                                                    </Form.Group>
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
        dtRes: state.outlets.dtRes || [],
        user: state.main.currentUser,
        isLoading: state.outlets.isLoading,
        isError: state.outlets.isError,
        isAddLoading: state.outlets.isAddLoading,
        contentMsg: state.outlets.contentMsg || null,
        showFormSuccess: state.outlets.showFormSuccess,
        tipeSWAL: state.outlets.tipeSWAL,
        errorPriority: state.outlets.errorPriority || null,
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
export default connect(mapStateToProps, mapDispatchToPros)(FormOutlet);