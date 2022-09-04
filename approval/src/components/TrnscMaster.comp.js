import React, {Component} from "react";
import TrnscMasterService from "../services/TrnscMaster.service";
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
        this.onClickAddAmendDet = this.onClickAddAmendDet.bind(this);
        this.retrieveTrnscDetailObjs = this.retrieveTrnscDetailObjs.bind(this);
        this.onChangeIndDepnd = this.onChangeIndDepnd.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.onChangeSearchApprovalStatus = this.onChangeSearchApprovalStatus.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.retrieveApprovalStatusList = this.retrieveApprovalStatusList.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onChangeSearchLookupDetailTrnscType = this.onChangeSearchLookupDetailTrnscType.bind(this);
        this.onClickRemoveDet = this.onClickRemoveDet.bind(this);
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
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
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


        TrnscMasterService.getAll(params)
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

    onClickSaveUpdate = () => {
        this.setState({loading: true});
        //alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            TrnscMasterService.create(
                this.state.currObj
            )
                .then(res => {

                    // alert('aaaaaaaaaa' + JSON.stringify(res.data));
                    console.log(res.data);
                    this.setState({

                        loading: false,
                        message: "Added Successfully!"
                    });
                    this.retrieveObjs();
                    this.clear();
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});
                });
        } else {

            TrnscMasterService.update(
                this.state.currObj.id,
                this.state.currObj
            )
                .then(res => {
                    console.log(res.data);
                    this.setState({
                        loading: false,
                        message: "Updated Successfully!"
                    });
                    this.retrieveObjs();
                    this.onClickLoadForm(this.state.currObj.id);
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});
                });
        }
    }

    deleteObj = () => {
        this.setState({loading: true});
        TrnscMasterService.delete(this.state.currObj.id)
            .then(res => {
                this.setState({
                    loading: false,
                    message: "Deleted Successfully!"
                });
                this.retrieveObjs();
                this.clear();
            })
            .catch(e => {
                console.log(e);
                this.setState({loading: false});
            });
    }

    deleteAlert = () => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteObj() //alert('Click Yes')
                },
                {
                    label: 'No',
                    onClick: () => null //alert('Click No')
                }
            ]
        });
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

    onClickRemoveDet = (idx) => {

        var obbb = this.state.currObj['lines'][(idx)];
//        var obbb = this.state.currDetObj;
        //alert(JSON.stringify(obbb));

        if (obbb.id !== undefined) {
            var xxx = this.state.currObj;
            var ggg;
            if (obbb._mode === 'DELETED') {
                obbb._mode = undefined;
                ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb} : el);

            } else {
                ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'DELETED'} : el);
            }
            xxx['lines'] = ggg;

            //   alert(JSON.stringify(xxx));
            this.setState({currObj: xxx, currDetObj: {code: '', description: ''}});
        } else {

            var xxx = this.state.currObj;
            var ttt = xxx['lines'];
            var ppp = ttt.splice(obbb._index, 1);
            xxx['lines'] = ttt;
//              alert(JSON.stringify(xxx));
            this.setState({currObj: xxx, currDetObj: {code: '', description: ''}});
        }
    }

    onClickAddAmendDet = () => {

        var obbb = this.state.currDetObj;

        if (!obbb.code) {
            alert("Enter Code");
            return;
        }

        //alert(JSON.stringify(obbb));
        var ggg;
        var xxx = this.state.currObj;

        if (obbb.id === undefined) {

            ggg = xxx['lines'];
            if (ggg === undefined)
                ggg = [];

            //var nam = this.state.authUsers.filter(x => x.value === obbb.auth_user_id)[0].label;
            //obbb['name'] = nam;

            if (obbb['_mode'] === undefined) {
                obbb['_mode'] = 'NEW';
                obbb['_index'] = ggg.length;

                ggg.push(obbb);
            } else {
                ggg = xxx['lines'].map(el => el._index === obbb._index ? {...el, ...obbb, _mode: 'NEW_UPDATED'} : el);
            }

        } else {
            //var nam = this.state.authUsers.filter(x => x.value === obbb.auth_user_id)[0].label;
            //obbb['name'] = nam;

            ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'UPDATED'} : el);
        }
        xxx['lines'] = ggg;
        //alert(JSON.stringify(xxx));
        this.setState({currObj: xxx, currDetObj: {code: '', description: ''}});
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
                                <Link
                                    to={"/trnscMasterForm/null"}
                                    className="btn btn-primary"
                                >
                                    Add New
                                </Link>

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
                                            <th scope="col">Code</th>
                                            <th scope="col">Transaction Type</th>
                                            <th scope="col">Transaction Date</th>
                                            <th scope="col">Total Amount</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Approval Status</th>

                                            <th scope="col">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {objs &&
                                        objs.map((obj, index) => (
                                            <tr>
                                                <td>{obj.code}</td>
                                                <td>{obj.lookupDetailTrnscType.code}</td>
                                                <td>{obj.trnscDate}</td>
                                                <td>{obj.totalAmount}</td>
                                                <td>{obj.description}</td>
                                                <td>{obj.approvalStatus}</td>

                                                <td>

                                                    <Link
                                                        to={"/trnscMasterView/" + obj.id}
                                                        className="btn btn-success"
                                                    >
                                                        View
                                                    </Link>
                                                    {obj.approvalStatus == 'NOT_SUBMITTED' || obj.approvalStatus == 'DOCUMENT_REQUEST' || obj.approvalStatus == 'REJECTED' ?
                                                        <Link
                                                            to={"/trnscMasterForm/" + obj.id}
                                                            className="btn btn-warning"
                                                        >
                                                            Edit
                                                        </Link> : null}

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


/*


 <div className="col-md-6">


 {currObj ? (
 <div>
 <div className="row">
 <div class="col-sm-6">
 <div className="form-group">
 <label htmlFor="code">Code</label>
 <input
 type="text"
 className="form-control"
 id="code"
 value={currObj.code}
 onChange={this.onChangeCode}
 />
 </div>

 </div>
 <div class="col-sm-6">

 <div className="form-group">
 <label htmlFor="name">Name</label>
 <input
 type="text"
 className="form-control"
 id="name"
 value={currObj.name}
 onChange={this.onChangeName}
 />
 </div>
 </div>

 <div class="col-sm-6">

 <div className="form-group">
 <label htmlFor="description">Description</label>
 <input
 type="text"
 className="form-control"
 id="description"
 value={currObj.description}
 onChange={this.onChangeDescription}
 />
 </div>
 </div>
 <div class="col-sm-6">

 <div className="form-group">
 <label htmlFor="type">Trnsc Type</label>
 <select id="type" className="form-control" 
 onChange={e => this.onChangeIndDepnd(e)}
 value={currObj.lookup_type}>
 <option value="INDEPENDENT">Independent</option>
 <option value="DEPENDENT">Dependent</option>
 </select>

 </div>
 </div>

 { currObj.lookup_type == "DEPENDENT" ?
 <div class="col-sm-6">

 <div className="form-group">
 <label htmlFor="lookup_detail_dependent_id">Parent Trnsc</label>

 <Select id="lookup_detail_dependent_id" options={this.state.lookup_details}
 className="form-control"
 values={this.state.lookup_details.filter(z => z.value == this.state.currObj.lookup_detail_dependent_id)} 
 onChange={v => this.onChangeTrnscDetailDependentId(v[0])} /> 
 </div>
 </div>
 : null}
 <div class="col-sm-6">

 <div className="form-group">
 <label>
 <input type="checkbox" checked={this.state.currObj.is_active}  onChange={this.onChangeIsActive} />
 <span>Active?</span>
 </label>
 </div>
 </div>
 </div>
 <div className="row">

 <div class="col-sm-6">

 {currObj.id ?
 <button
 className="btn btn-danger"
 onClick={this.deleteAlert}

 >
 Delete
 </button>
 : null}
 <button
 type="button"
 className="btn btn-success"
 onClick={this.onClickSaveUpdate}

 >
 {currObj.id ? 'Update' : 'Save'}
 </button>
 </div>
 <p>{this.state.message}</p>
 </div>
 <h5>Trnsc Details</h5>

 <div className="row">

 <div class="col-sm-6">


 <div className="form-group">
 <label htmlFor="codeDet">Code</label>

 <input
 type="text"
 className="form-control"
 id="codeDet"
 value={this.state.currDetObj.code}
 onChange={this.onChangeCodeDet}
 />
 </div>
 </div>
 <div class="col-sm-6">

 <div className="form-group">
 <label htmlFor="codeDes">Description</label>

 <input
 type="text"
 className="form-control"
 id="codeDes"
 value={this.state.currDetObj.description}
 onChange={this.onChangeDescriptionDet}
 />
 </div>
 </div>
 <div class="col-sm-6">

 <div className="form-group">
 <label>
 <input type="checkbox" checked={this.state.currDetObj.is_entry_enable}  
 onChange={this.handleChangeIsEnableDet} />
 <span>Entry Enable?</span>
 </label>
 </div>
 </div>
 <div class="col-sm-6">

 <div className="form-group">
 <label>
 <input type="checkbox" checked={this.state.currDetObj.is_active}  
 onChange={this.handleChangeIsActiveDet} />
 <span>Active?</span>
 </label>
 </div>
 </div>
 </div>
 <div className="row">

 <div class="col-sm-6">

 <button
 className={ Object.keys(this.state.currDetObj).length == 0 ? 'btn btn-primary' : 'btn btn-info'}

 type="button"
 onClick={this.onClickAddAmendDet}
 >
 { this.state.currObj.lines.length == 0 || Object.keys(this.state.currDetObj).length == 0 ? 'Add' : 'Amend'}
 </button>

 { Object.keys(this.state.currDetObj).length != 0 ?
 <button
 className="btn btn-warning"
 type="button"
 onClick={this.onClickClearDet}
 >
 New
 </button> : null}
 </div>
 </div>


 <div className="row">

 <div class="col-sm-12">

 <table class="table table-sm">
 <thead>
 <tr>

 <th scope="col">Code</th>
 <th scope="col">Entry?</th>
 <th scope="col">Active?</th>
 <th scope="col">Action</th>
 </tr>
 </thead>
 <tbody>

 {currObj.lines &&
 currObj.lines.map((obj, index) => (
 <tr>                                            


 <td>{obj.code}</td>
 <td>{obj.is_entry_enable ? 'Yes' : 'No'}</td>
 <td>{obj.is_active ? 'Yes' : 'No'}</td>
 <td>
 <button name={index}
 type="button"
 className="btn btn-success"
 onClick={this.onClickLoadDet}
 >
 Load
 </button>
 <button name={index}
 className={this.state.currObj.lines[index]._mode === 'DELETED' ? 'btn btn-primary' : 'btn btn-danger'}
 onClick={(e) => this.onClickRemoveDet(e.target.name)}
 >
 {this.state.currObj.lines[index]._mode === 'DELETED' ? 'UnDelete' : 'Delete'}

 </button>
 </td>
 </tr>

 ))}
 </tbody>
 </table>

 </div>
 </div>
 </div>
 ) : (
 <div>
 <br />
 <p>Please click on a Trnsc...</p>
 </div>
 )}
 </div>

 */