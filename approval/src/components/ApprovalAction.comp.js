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
export default class  ApprovalAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            mstId: null,
            loading: false,
            visible: true,
            //    mst_id: 1, 
            //    status: 'SUBMITTED', // NOT_SUBMITTED, SUBMITTED, DOCUMENT_REQUEST, REJECTED, APPROVED,
            cmd: '',
            remarks: '',
            auth_user_forward_to_id: null,
            auth_users: []
        };
    }

    componentDidMount() {

        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        //this.setState({mstId: this.props.mst_id});

        this.isShoWed(this.props.mst_id);
        this.retrieveAuthUserObjs();
    }

    isShoWed = (mId) => {

        this.setState({
            loading: true,
        });
        var dtm = {mstId: mId,
            uid: this.props.uid,
            tableName: this.props.document_root
        };

        ApprovalService.isShowApprovalPanel(
                dtm)
                .then((res) => {

                    var mmm = res.data;
                    //  alert(mmm);
                    console.log(res.data);

                    this.setState({
                        loading: false,
                        visible: true || res.data > 0
                    });
                })
                .catch((e) => {
                    alert(e);
                    console.log(e);
                    this.setState({
                        loading: false
                    });
                });
    }

    retrieveAuthUserObjs = () => {

        this.setState({loading: true});
        AuthService.getAllMinimal()
                .then((res) => {
                    //alert(JSON.stringify(res.data));
                    console.log(res.data);

                    this.setState({
                        loading: false,
                        auth_users: res.data,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    //alert(JSON.stringify(e));

                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
    }

    onApprovalAction = (cmd, e) => {
//mst_id,status in props
//send rest to server with status and mst_id


        if (this.props.amount == 0) {
            alert("Amount is ZERO, can not submit.");
            return;
        }

        confirmAlert({
            title: 'Confirm to ' + cmd,
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async() => {
                        this.setState({loading: true});
                        //alert(JSON.stringify(this.state.currObj));

                        ApprovalService.submit(
                                {uid: this.props.uid, mst_id: this.props.mst_id,
                                    auth_user_forward_to_id: this.state.auth_user_forward_to_id,
                                    remarks: this.state.remarks, cmd: cmd,
                                    document_root: this.props.document_root,
                                    url_root: this.props.url_root,
                                }
                        )
                                .then(res => {

                                    //alert('aaaaaaaaa5326a' + JSON.stringify(res.data));
                                    console.log(res.data);
                                    this.setState({
                                        loading: false,
                                        //message: "Added Successfully!"
                                    });

                                    if (cmd === 'SUBMIT')
                                        this.props.loadListPage();
                                    else
                                        this.props.loadDashboard();
                                })
                                .catch(e => {
                                    console.log(e);
                                    //alert('failes' + JSON.stringify(e));
                                    this.setState({loading: false});



                                });
                    }
                },
                {
                    label: 'No',
                    //   onClick: () => alert('Click No')
                }
            ]
        });




    }

    forwardReset = () => {
        this.setState({auth_user_forward_to_id: null});
    }

    onChangeAprvUserId = (e) => {

        if (!e)
            return;

        const val = e;
        this.setState({auth_user_forward_to_id: val.value});
    }

    myChangeHandler = (e) => {
        var nam = e.target.name;
        var val = e.target.value;

        this.setState({[nam]: val});
    }

    render() {
        /*
         if (this.state.redirect) {
         return <Redirect to={this.state.redirect} />
         }
         */
        const {remarks, auth_user_forward_to_id, visible} = this.state;
        const {status} = this.props;


        var ddd = <div class="col-sm-6">
        
            {status == 'NOT_SUBMITTED' || status == 'DOCUMENT_REQUEST' || status == 'REJECTED' ?
                            <button
                                className='btn btn-primary'
                                type="button"
                                onClick={(e) => this.onApprovalAction('SUBMIT', e)}
                                >
                                { status == 'DOCUMENT_REQUEST' ? 'Add/Remove Document and Re-Submit' : status == 'REJECTED' ? 'Re-Submit' : 'Submit'}
                            </button> : null}
        
            {status == 'NOT_SUBMITTED' || status == 'DOCUMENT_REQUEST' || status == 'REJECTED' ?
                            <Link
                                to={"/" + this.props.url_root + "/" + this.props.mst_id}
                                className="btn btn-warning"
                                >
                            Edit
                            </Link> : null}
        
            {status == 'SUBMITTED' ?
                            <span>
                                <button
                                    disabled={auth_user_forward_to_id != null}
                                    className='btn btn-success'
                                    type="button"
                                    onClick={(e) => this.onApprovalAction('APPROVE', e)}
                                    >
                                    Approve
                                </button>
                        
                                <button
                                    disabled={!remarks || auth_user_forward_to_id != null}
                                    className='btn btn-danger'
                                    type="button"
                                    onClick={(e) => this.onApprovalAction('REJECT', e)}
                                    >
                                    Reject
                                </button>
                                <button
                                    disabled={!remarks || auth_user_forward_to_id != null}
                                    className='btn btn-info'
                                    type="button"
                                    onClick={(e) => this.onApprovalAction('DOCUMENT_REQUEST', e)}
                                    >
                                    Document Request
                                </button>
                                <button
                                    disabled={!remarks || auth_user_forward_to_id == null}
                                    className='btn btn-warning'
                                    type="button"
                                    onClick={(e) => this.onApprovalAction('FORWARD', e)}
                                    >
                                    Forward
                                </button>
                                <button 
                                    disabled={auth_user_forward_to_id === null}
                                    className='btn btn-primary'
                                    type="button"
                                    onClick={this.forwardReset}>
                                    Reset
                                </button>
                        
                                <input
                                    type="text"
                                    name="remarks"
                                    className="form-control"
                                    placeholder="Remarks need for Denied/Document Request/Forward"
                                    value={remarks}
                                    onChange={this.myChangeHandler}
                                    />
                        
                                <Select options={this.state.auth_users}
                                        className="form-control"
                                        values={this.state.auth_users.filter(z => z.value == auth_user_forward_to_id)} 
                                        onChange={v => this.onChangeAprvUserId(v[0])} />
                            </span>
                                : null}
        </div>;

        return (visible ? ddd : null);
    }
}