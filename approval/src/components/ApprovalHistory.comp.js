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
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

//reusable comp
export default class  ApprovalHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            loading: false,
            approvalHistoryList: [],
        };
    }

    componentDidMount() {

        //       if (!AuthService.isAuth())
        //           this.setState({redirect: "/index"});

        //this.setState({mstId: this.props.mst_id});

        this.loadHistoryList(this.props.mst_id);
//        this.isShoWed(this.props.mst_id);
//        this.retrieveAuthUserObjs();
    }

    loadHistoryList = (id) => {

        this.setState({
            loading: true,
            //   message: undefined
        });
        ApprovalService.getHistoryList(id)
                .then((res) => {
                    //alert(JSON.stringify(res.data));
                    var mmm = res.data;
                    // alert(JSON.stringify(mmm));

                    console.log(res.data);

                    this.setState({
                        loading: false,
                        approvalHistoryList: mmm
                    });
                })
                .catch((e) => {
                    //alert(JSON.stringify(e));

                    console.log(e);
                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
    }

    render() {
        /*
         if (this.state.redirect) {
         return <Redirect to={this.state.redirect} />
         }
         */
        const {approvalHistoryList} = this.state;


        var ddd = <div className="row">
        
            <div class="col-sm-12">
        
                <h5>Approval History</h5>
        
                <table class="table table-sm">
                    <thead>
                        <tr>
        
                            <th scope="col">Level</th>
                            <th scope="col">Approval Name/Group</th>
                            <th scope="col">Request Date</th>
                            <th scope="col">Response Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action By</th>
                            <th scope="col">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
        
                        {approvalHistoryList &&
                                            approvalHistoryList.map((obj, index) => (
                                        <tr>                                            
                                            <td>{obj.levelNo}</td>
                                            <td>{obj.name}</td>
                        
                                            <td>{ moment(obj.reqDate).format('YYYY-MM-DD') }</td>
                                            <td>{ obj.resDate ? moment(obj.resDate).format('YYYY-MM-DD') : '' }</td>
                                            <td>{obj.status}</td>
                                            <td>{obj.authUserActionByName}</td>
                                            <td>{obj.remarks}</td>
                                        </tr>

                                                        ))}
                    </tbody>
                </table>
            </div>
        </div>;

        if (approvalHistoryList && approvalHistoryList.length>0)
            return ddd;
        else
            return null;
        //return ddd; 
    }
}