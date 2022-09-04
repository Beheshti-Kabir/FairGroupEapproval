import React, { Component } from "react";
import TrnscMasterService from "../services/TrnscMaster.service";
import LookupDetailService from "../services/LookupDetail.service";
import ApprovalService from "../services/Approval.service";
import AuthUserService from "../services/AuthUser.service";
import FILES_BASE_URL from "../services/Files.service";
import AuthService from "../services/Auth.service";
import moment from 'moment';
import { Link, Redirect } from "react-router-dom";
import Layout from "./Layout.comp";
import ApprovalAction from "./ApprovalAction.comp";
import ApprovalHistory from "./ApprovalHistory.comp";
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default class TrnscMasterView extends Component {
    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.loadListPage = this.loadListPage.bind(this);
        this.loadDashboard = this.loadDashboard.bind(this);
        this.state = {
            redirect: null,
            loading: false,
            currUser:{},
            currObj: {},
            lookupDetailTrnscType: {},
            lookupDetailFundSource: {},

        };
    }

    componentDidMount() {
             AuthUserService.get(AuthService.getUid())
                .then((res) => {
                    var mmm = res.data;

                    this.setState({
                        loading: false,
                        currUser: mmm
                    });
                    console.log(res.data);
                })
                .catch((e) => {
                    console.log(e);
                    //   alert(JSON.stringify(e));

                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
            this.reload();
        }

    onClickLoadForm = (id) => {
//alert(JSON.stringify(id));

        this.setState({
            loading: true,
            //   message: undefined
        });
        TrnscMasterService.get(id)
                .then((res) => {
                    //alert(JSON.stringify(res.data));
                    var mmm = res.data;

                    this.setState({
                        loading: false,
                        currObj: mmm,
                        lookupDetailTrnscType: mmm.lookupDetailTrnscType,
                        lookupDetailFundSource: mmm.lookupDetailFundSource
                    });

                })
                .catch((e) => {
                    //   alert(JSON.stringify(e));

                    console.log(e);
                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
    }
    
    loadListPage=()=>{
        
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

    this.setState({redirect: "/trnscMaster"});
    }
    
    loadDashboard=()=>{
        
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

    this.setState({redirect: "/dashboard"});
    }

    reload = () => {
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        var id = this.props.match.params.id;
        //  alert(id);

        if (id !== 'null') {
            this.onClickLoadForm(id);
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const {currObj, lookupDetailTrnscType,lookupDetailFundSource, currUser} = this.state;

//<!--<Loading loading=this.state.loading background="#2ecc71" loaderColor="#3498db" />-->

        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Transaction</h3>
                
                    <div className="xcontainer">
    {currUser.userType=='USER'||currUser.userType=='ADMIN'?
            <div className="row">
                        <Link
                            to={"/trnscMasterForm/null"}
                            className="btn btn-primary"
                            >
                        Add New
                        </Link>
                
                        <Link
                            to={"/trnscMaster"}
                            className="btn btn-info"
                            >
                        List
                        </Link>
</div>:'' }
                        <div>
                            <div className="row">
                
                
                                <div class="card-body">
                
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <h6 class="mb-0">Code</h6>
                                            </div>
                                            <div class="col-sm-8 text-secondary">
                                                {currObj.code}
                                            </div>
                                        </div>
                
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <h6 class="mb-0">Document Type</h6>
                                        </div>
                                        <div class="col-sm-8 text-secondary">
                                            {lookupDetailTrnscType.code}
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">
                                        <h6 class="mb-0">Fund Source</h6>
                                    </div>
                            {currObj.lookupDetailFundSource!=null?
                                    <div class="col-sm-8 text-secondary">
                                        {lookupDetailFundSource.code}
                                    </div>:'' }
                                    </div>
                
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <h6 class="mb-0">Date</h6>
                                        </div>
                                        <div class="col-sm-8 text-secondary">
                                            {currObj.trnscDate}
                                        </div>
                                    </div>
                
                
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <h6 class="mb-0">Description</h6>
                                        </div>
                                        <div class="col-sm-8 text-secondary">
                                            {currObj.description}
                                        </div>
                                    </div>
                
                
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <h6 class="mb-0">Total Amount</h6>
                                        </div>
                                        <div class="col-sm-8 text-secondary">
                                            {currObj.totalAmount}
                                        </div>
                                    </div>
                
                
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <h6 class="mb-0">Approval Status</h6>
                                        </div>
                                        <div class="col-sm-8 text-secondary">
                                            {currObj.approvalStatus}
                
                                        </div>
                                    </div>
                                </div>
                
                                {
                                 currUser.userType=='ADMIN'||currUser.userType=='APPROVER'||currObj.approvalStatus=='NOT_SUBMITTED'||currObj.approvalStatus=='REJECTED'?
                                 <ApprovalAction  mst_id={this.props.match.params.id}
                                    url_root={'trnscMasterForm'}
                                    document_root={'trnsc_master'}
                                    uid={currUser.id}

                                    loadListPage={this.loadListPage}
                                    loadDashboard={this.loadDashboard}
                                    amount={currObj.totalAmount}
                                    status={currObj.approvalStatus}/>:''

                                    }

                
                            </div>
                            {currObj.id ? <div className="row">
                
                
                                <div class="col-sm-6">
                
                
                                    <h5>Transaction Attachments</h5>
                                    <div >
                
                                        {currObj.trnscAttachs &&
                                                    currObj.trnscAttachs.map((obj, index) => (
                                                                                        <a className="btn btn-info" style={{margin: "3px"}} target = '_blank' 
                                                                                           href={FILES_BASE_URL + "transAttach/" + obj.code}>
                                                                                            {obj.name} ({(obj.fileSize / 1024).toFixed(2)} KB)
                                                                                        </a>



                                                                                        ))}
                
                                    </div>
                                </div>
                            </div>
                            : null}
                
                
                            <div className="row">
                
                                <div class="col-sm-12">
                
                                    <h5>Transaction Details</h5>
                
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                
                                                <th scope="col">SLNo</th>

                                                <th scope="col">Description</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currObj.trnscDetails &&
                            currObj.trnscDetails.map((obj, index) => (
                                                                            <tr>                                            
                                                
                                                
                                                                                <td>{index + 1}</td>
                                                                                <td>{obj.description}</td>
                                                                                <td>{obj.lineTotal}</td>
                                                                                <td>{obj.remarks}</td>
                                                                            </tr>

                                                                    ))}
                                        </tbody>
                                    </table>
                
                                </div>
                            </div>
                        </div>
                        <ApprovalHistory mst_id={this.props.match.params.id}/>
                
                    </div>
                </Layout>

                );
    }
}