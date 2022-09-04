import React, {Component} from "react";
import TrnscMasterService from "../services/TrnscMaster.service";
import ApprovalHistoryService from "../services/ApprovalHistory.service";
import ApprovalService from "../services/Approval.service";
import LookupDetailService from "../services/LookupDetail.service";
import AuthService from "../services/Auth.service";
import {Link, Redirect} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class TrnscMaster extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.retrieveTrnscDetailObjs = this.retrieveTrnscDetailObjs.bind(this);
        this.onChangeIndDepnd = this.onChangeIndDepnd.bind(this);
        this.onChangeSearchApprovalStatus = this.onChangeSearchApprovalStatus.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.retrieveApprovalStatusList = this.retrieveApprovalStatusList.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onChangeSearchLookupDetailTrnscType = this.onChangeSearchLookupDetailTrnscType.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onClickLoadDet = this.onClickLoadDet.bind(this);
        this.handleChangeIsActiveDet = this.handleChangeIsActiveDet.bind(this);
        this.handleChangeIsEnableDet = this.handleChangeIsEnableDet.bind(this);
        this.onChangeTrnscDetailDependentId = this.onChangeTrnscDetailDependentId.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onChangeCodeDet = this.onChangeCodeDet.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDescriptionDet = this.onChangeDescriptionDet.bind(this);
        this.onChangeIsActive = this.onChangeIsActive.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            redirect: null,
            loading: false,
            objs: [],
            lookup_details: [],
            currObj: null,
            currDetObj: {},
            searchTitle: "",
            lookup_details_mm: [],
            searchApprovalStatusList: [],
            searchLookupDetailTrnscType: null,
            searchApprovalStatus: null,
            page: 1,
            count: 0,
            pageSize: 5,
        };
        this.pageSizes = [5, 10, 15];
    }

    componentDidMount() {
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});


        this.setState({

            searchApprovalStatusList: [
                {label:'NOT SUBMITTED', value:'NOT_SUBMITTED'},
                {label:'SUBMITTED', value:'SUBMITTED'},
                {label:'APPROVED', value:'APPROVED'},
                {label:'DOCUMENT REQUEST', value:'DOCUMENT_REQUEST'},
                {label:'REJECTED', value:'REJECTED'}
            ]
        });

        //this.retrieveApprovalStatusList();
        this.retrieveTrnscDetailMmObjs();

        this.retrieveTrnscDetailObjs();
        this.retrieveObjs();
        this.clear();
    }

    retrieveApprovalStatusList = () => {

        this.setState({loading: true});
        ApprovalService.approvalStatusList({_mandatory: false})
            .then((res) => {
                alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    searchApprovalStatusList: res.data,
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

    retrieveTrnscDetailMmObjs = () => {

        this.setState({loading: true});
        LookupDetailService.getAllLookupDetailsDocType({_req_auth_user_id: AuthService.getUid()})
            .then((res) => {
                //alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    lookup_details_mm: res.data,
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

    onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        this.setState({
            searchTitle: searchTitle,
        });
    }

    onChangeSearchLookupDetailTrnscType = (e) => {

        if (!e)
            return;
        const val = e;
        this.setState({
            searchLookupDetailTrnscType: {id: val.value, code: val.label}
        });

        //alert(JSON.stringify(this.state.searchLookupDetailTrnscType));

        //this.retrieveTrnscDetailDdObjs(val.value);
    }


    onChangeSearchApprovalStatus = (e) => {

        if (!e)
            return;
        const val = e;
        this.setState({
            searchApprovalStatus: {id: val.value, code: val.label}
        });

        //alert(JSON.stringify(this.state.searchLookupDetailTrnscType));

        //this.retrieveTrnscDetailDdObjs(val.value);
    }


    getRequestParams = (searchTitle, searchLookupDetailTrnscType, searchApprovalStatus, page, pageSize) => {
        let params = {};
        if (searchLookupDetailTrnscType) {
            params["searchLookupDetailTrnscTypeId"] = searchLookupDetailTrnscType.id;

        }
        if (searchTitle) {
            params["searchTitle"] = searchTitle;
        }

        if (searchApprovalStatus) {
            params["approvalStatus"] = searchApprovalStatus.id;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    }

    retrieveTrnscDetailObjs = () => {

        this.setState({loading: true});

        LookupDetailService.getAllLookupDetailsDocType({_req_auth_user_id: AuthService.getUid()})
            .then((res) => {
                //alert(JSON.stringify(res.data));
                console.log(res.data);

                this.setState({
                    loading: false,
                    lookup_details: res.data,
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

    retrieveObjs = () => {
        this.setState({loading: true});
        const {searchTitle, searchLookupDetailTrnscType, searchApprovalStatus, page, pageSize} = this.state;


        const params = this.getRequestParams(searchTitle, searchLookupDetailTrnscType, searchApprovalStatus, page, pageSize);
        params['_req_auth_user_id'] = AuthService.getUid();


    ApprovalHistoryService.getAll(params)
            .then((res) => {
                // alert(JSON.stringify(res.data));
                const {objs, totalPages} = res.data;
                this.setState({
                    loading: false,
                    objs: objs,
                    count: totalPages,
                });
                console.log(res.data);
            })
            .catch((e) => {
                // alert(JSON.stringify(e));

                console.log(e);
                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

    onClickLoadDet = (e) => {
        var fff = e.target.name;
        var obj = this.state.currObj.lines[fff];

        this.setState({
            currDetObj: obj
        });
    }

    onClickLoadForm = (id) => {
        //alert(JSON.stringify(fff));

        this.setState({
            loading: true,
            //   message: undefined
        });
        TrnscMasterService.get(id)
            .then((res) => {
                //               alert(JSON.stringify(res.data));
                var mmm = res.data;
                var nwLins = [];
                for (var i = 0; i < mmm.lines.length; i++) {
                    var onLine = mmm.lines[i];
                    //var nam = this.state.authUsers.filter(x => x.value === onLine.auth_user_id)[0].label;

                    // var xxx = this.state.currObj;
                    //onLine['name'] = namc;
                    onLine['_index'] = i;

                    nwLins.push(onLine);
                }
                mmm['lines'] = nwLins;
                // alert(JSON.stringify(mmm));

                this.setState({
                    loading: false,
                    currObj: mmm
                });
                console.log(res.data);
            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

    handlePageChange = (event, value) => {
        this.setState(
            {
                page: value,
            },
            () => {
                this.retrieveObjs();
            }
        );
    }

    handlePageSizeChange = (event) => {
        this.setState(
            {
                pageSize: event.target.value,
                page: 1
            },
            () => {
                this.retrieveObjs();
            }
        );
    }

    onChangeCode = (e) => {
        const val = e.target.value;
        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    code: val
                }
            };
        });
    }
    onChangeName = (e) => {
        const val = e.target.value;
        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    name: val
                }
            };
        });
    }

    onChangeIndDepnd = (e) => {
        const val = e.target.value;

        if (val === 'INDEPENDENT') {

            this.setState(function (prevState) {
                return {
                    currObj: {
                        ...prevState.currObj,
                        lookup_detail_dependent_id: null
                    }
                };
            });
        }

        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    lookup_type: val
                }
            };
        });
    }

    onChangeCodeDet = (e) => {
        const val = e.target.value;
        this.setState(function (prevState) {
            return {
                currDetObj: {
                    ...prevState.currDetObj,
                    code: val
                }
            };
        });
    }

    handleChangeIsActiveDet = (e) => {
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                is_active: !this.state.currDetObj['is_active']
            }
        }));
    }

    handleChangeIsEnableDet = (e) => {
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                is_entry_enable: !this.state.currDetObj['is_entry_enable']
            }
        }));
    }
    onChangeTrnscDetailDependentId = (e) => {
        //if (!e)
        //    return;
        const val = e;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                lookup_detail_dependent_id: val.value
            }
        }));
    }

    onChangeIsActive = (e) => {
//var xxx = this.state.currObj;
//xxx['is_active'] = ! this.state.currObj['is_active'];
//this.setState({currObj: xxx});

        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                is_active: !this.state.currObj['is_active']
            }
        }));
    }

    onChangeDescription = (e) => {
        const val = e.target.value;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                description: val
            }
        }));
    }

    onChangeDescriptionDet = (e) => {
        const val = e.target.value;
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                description: val
            }
        }));
    }






    clear = () => {
        this.setState({
            message: '',
            currObj: {
                code: '',
                name: '',
                description: '',
                lookup_detail_dependent_id: null,
                lookup_type: 'INDEPENDENT',
                is_active: false,
                lines: []
            }
        });
    }

    onClickClearDet = () => {
        this.setState({
            currDetObj: {code: '', description: ''},
        });
    }





    getLabel = id => {
        //  alert(id);
        var kk = this.state.lookup_details.filter(x => x.value === id);

        if (kk === null || kk === undefined || kk[0] === undefined)
            return ''
        else
            return kk[0].label;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {
            searchTitle,
            objs,
            currObj,
            page,
            count,
            pageSize,
        } = this.state;
//<!--<Loading loading=this.state.loading background="#2ecc71" loaderColor="#3498db" />-->

        return (
            <Layout>
                <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db"/>

                <h3>Transaction</h3>

                <div className="xcontainer">

                    <div className="row">
                        <div className="col-md-12">

                            <div className="input-group mb-3">


                                <div class="col-sm-3">

                                    <div className="form-group">
                                        <label htmlFor="searchApprovalStatusList">Approval Status</label>

                                        <Select id="searchApprovalStatusList" options={this.state.searchApprovalStatusList}
                                                className="form-control"
                                                values={this.state.searchApprovalStatusList.filter(z => currObj.searchApprovalStatus && z.value === currObj.searchApprovalStatus.id)}
                                                onChange={v => this.onChangeSearchApprovalStatus(v[0])}/>
                                    </div>
                                </div>

                                <div class="col-sm-3">

                                    <div className="form-group">
                                        <label htmlFor="lookupDetailDependent">Document Type</label>

                                        <Select id="lookupDetailDependent" options={this.state.lookup_details_mm}
                                                className="form-control"
                                                values={this.state.lookup_details_mm.filter(z => currObj.searchLookupDetailTrnscType && z.value === currObj.searchLookupDetailTrnscType.id)}
                                                onChange={v => this.onChangeSearchLookupDetailTrnscType(v[0])}/>
                                    </div>
                                </div>

                                <div class="col-sm-3">

                                    <div className="form-group">
                                        <label htmlFor="lookupDetailDependent">Free Text</label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by Name"
                                            value={searchTitle}
                                            onChange={this.onChangeSearchTitle}
                                        />
                                    </div>
                                </div>

                                <div class="col-sm-3">

                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-info"
                                            type="button"
                                            onClick={this.retrieveObjs}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">

                                {"Items per Page: "}
                                <select class="form-control-sm" onChange={this.handlePageSizeChange} value={pageSize}>
                                    {this.pageSizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                <Pagination
                                    className="my-3"
                                    count={count}
                                    page={page}
                                    siblingCount={1}
                                    boundaryCount={1}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={this.handlePageChange}
                                />
                            </div>

                            <div className="row">

                                <div class="col-sm-12 p-1">

                                    <table class="table table-sm">
                                        <thead>
                                        <tr>
                                            <th scope="col">Level No</th>
                                            <th scope="col">Document Type</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Request Date</th>
                                            <th scope="col">Response Date</th>
                                            <th scope="col">Remarks</th>
                                            <th scope="col">Submit By</th>

                                            <th scope="col">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {objs &&
                                        objs.map((obj, index) => (
                                            <tr>
                                                <td>{obj.levelNo}</td>
                                                <td>{obj.docType}</td>
                                                <td>{obj.status}</td>
                                                <td>{obj.reqDate}</td>
                                                <td>{obj.resDate}</td>
                                                <td>{obj.Remarks}</td>
                                                <td>{obj.AuthUserPervName}</td>

                                                <td>

                                                    <Link
                                                        to={"/trnscMasterView/" + obj.mstId}
                                                        className="btn btn-success"
                                                    >
                                                        View
                                                    </Link>
                                                 </td>
                                            </tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>

        );
    }
}


