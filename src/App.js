import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css';

import {Login, Main, PageLoading} from './Template';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';

const Members = React.lazy(() => import('./features/Members'));
const Banner = React.lazy(() => import('./features/Banners'));
const BannerCargo = React.lazy(() => import('./features/Banners/Cargo'));
const BannerKurir = React.lazy(() => import('./features/Banners/Kurir'));
const Home = React.lazy(() => import('./features/Beranda'));
const Setting = React.lazy(() => import('./features/Setting'));
const Faq = React.lazy(() => import('./features/Faq'));
const FormFaq = React.lazy(() => import('./features/Faq/FaqForm'));
const FaqDriver = React.lazy(() => import('./features/Faq/FaqDriver'));
const Level = React.lazy(() => import('./features/Level'));
const Users = React.lazy(() => import('./features/Users'));
const Asuransi = React.lazy(() => import('./features/Asuransi'));
const BM = React.lazy(() => import('./features/BongkarMuat'));
const BiayaInap = React.lazy(() => import('./features/BiayaInap'));
const Outlets = React.lazy(() => import('./features/Outlets'));
const FormOutlet = React.lazy(() => import('./features/Outlets/FormOutlet'));
const Cargo = React.lazy(() => import('./features/Cargo'));
const FormCargo = React.lazy(() => import('./features/Cargo/FormCargo'));
const Provinsi = React.lazy(() => import('./features/Area/Provinsi'));
const City = React.lazy(() => import('./features/Area/City'));
const Kec = React.lazy(() => import('./features/Area/Kec'));
const Kel = React.lazy(() => import('./features/Area/Kel'));
const Mapping = React.lazy(() => import('./features/Area/Mapping'));
const PriceList = React.lazy(() => import('./features/PriceList'));
const WaitingPayment = React.lazy(() => import('./features/Transaksi/WaitingPayment'));
const PaymentCompleted = React.lazy(() => import('./features/Transaksi/PaymentCompleted'));
const OnProcess = React.lazy(() => import('./features/Transaksi/OnProcess'));
const Completed = React.lazy(() => import('./features/Transaksi/Completed'));
const TransDetail = React.lazy(() => import('./features/Transaksi/TransDetail'));
const Drivers = React.lazy(() => import('./features/Drivers'));
const DriverDetail = React.lazy(() => import('./features/Drivers/driverDetail'));

const getBasename = path => path.substr(0, path.lastIndexOf('/'));

function App() {
    return (
        <div className="App">
            <Router basename={getBasename(window.location.pathname)}>
                <Switch>
                    <PublicRoute exact path="/login">
                        <Login/>
                    </PublicRoute>

                    <PublicRoute exact path="/test">
                        <PageLoading/>
                    </PublicRoute>


                    <ProtectedRoute path="/">
                        <Main>
                            <React.Suspense fallback={<PageLoading/>}>
                                <Route exact path="/" component={Home}/>

                                <Route exact path="/kebut" component={Home}/>
                                <Route exact path="/members" component={Members}/>
                                <Route exact path="/banner" component={Banner}/>
                                <Route exact path="/banner_cargo" component={BannerCargo}/>
                                <Route exact path="/banner_kurir" component={BannerKurir}/>
                                <Route exact path="/setting" component={Setting}/>
                                <Route exact path="/faq_cust" component={Faq}/>
                                <Route exact path="/faq_driver" component={FaqDriver}/>
                                <Route exact path="/add_faq" component={FormFaq}/>
                                <Route exact path="/level" component={Level}/>
                                <Route exact path="/users" component={Users}/>
                                <Route exact path="/asuransi" component={Asuransi}/>
                                <Route exact path="/bongkar_muat" component={BM}/>
                                <Route exact path="/biaya_inap" component={BiayaInap}/>
                                <Route exact path="/outlets" component={Outlets}/>
                                <Route exact path="/add_outlet" component={FormOutlet}/>
                                <Route exact path="/cargo" component={Cargo}/>
                                <Route exact path="/add_cargo" component={FormCargo}/>
                                <Route exact path="/provinsi" component={Provinsi}/>
                                <Route exact path="/city" component={City}/>
                                <Route exact path="/kecamatan" component={Kec}/>
                                <Route exact path="/kelurahan" component={Kel}/>
                                <Route exact path="/mapping_area" component={Mapping}/>
                                <Route exact path="/ongkir" component={PriceList}/>
                                <Route exact path="/waiting_payment" component={WaitingPayment}/>
                                <Route exact path="/payment" component={PaymentCompleted}/>
                                <Route exact path="/onprocess" component={OnProcess}/>
                                <Route exact path="/completed" component={Completed}/>
                                <Route exact path="/trans_detail" component={TransDetail}/>
                                <Route exact path="/drivers" component={Drivers}/>
                                <Route exact path="/driver_detail" component={DriverDetail}/>
                            </React.Suspense>
                        </Main>
                    </ProtectedRoute>
                </Switch>
            </Router>

        </div>
    );
}

export default App;
