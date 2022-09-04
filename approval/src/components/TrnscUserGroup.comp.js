import React, { Component } from "react";
import TrnscUserGroupService from "../services/TrnscUserGroup.service";
import AuthUserService from "../services/AuthUser.service";
import TrnscMasterService from "../services/TrnscMaster.service";
import LookupDetailService from "../services/LookupDetail.service";
import AuthService from "../services/Auth.service";
import { Redirect, Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class TrnscUserGroup extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.onClickAddAmendDet = this.onClickAddAmendDet.bind(this);
        this.retrieveAuthUserObjs = this.retrieveAuthUserObjs.bind(this);
        this.retrieveTrnscDetailDdObjs = this.retrieveTrnscDetailDdObjs.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onClickRemoveDet = this.onClickRemoveDet.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onClickLoadDet = this.onClickLoadDet.bind(this);
        this.handleChangeIsUserActChk = this.handleChangeIsUserActChk.bind(this);
        this.handleChangeUserSel = this.handleChangeUserSel.bind(this);
        this.handleChangeTrnscType = this.handleChangeTrnscType.bind(this);
        this.handleChangeIsActChk = this.handleChangeIsActChk.bind(this);
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            redirect: null,
            loading: false,
            objs: [],
            authUsers: [],
            lookup_details_dd: [],
            currObj: null,
            currDetObj: {},
            searchTitle: "",
            page: 1,
            count: 0,
            pageSize: 5,
        };
        this.pageSizes = [5, 10, 15];
    }

    componentDidMount() {
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        this.retrieveObjs();
        this.clear();
        this.retrieveAuthUserObjs();
        this.retrieveTrnscDetailDdObjs();
        }



    onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        this.setState({
            searchTitle: searchTitle,
        });
    }

    getRequestParams = (searchTitle, page, pageSize) => {
        let params = {};
        if (searchTitle) {
            params["title"] = searchTitle;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    }



    retrieveTrnscDetailDdObjs = () => {

        this.setState({loading: true});
    LookupDetailService.getAllLookupDetailParentCode({parent_code: "DOCUMENT_TYPE"})
            .then((res) => {
         //   alert(JSON.stringify(res.data));
        console.log(res.data);

        this.setState({
            loading: false,
            lookup_details_dd: res.data,
        });
    })
    .catch((e) => {
            console.log(e);
        //alert(JSON.stringify(e));

        this.setState({
            loading: false
        });

    });
    }
    retrieveAuthUserObjs = () => {

        this.setState({loading: true});
        AuthService.getAllMinimal()
                .then((res) => {
                 //   alert(JSON.stringify(res.data));
                    console.log(res.data);

                    this.setState({
                        loading: false,
                        authUsers: res.data,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    //alert(JSON.stringify(e));

                    this.setState({
                        loading: false
                    });

                });
    }

    retrieveObjs = () => {
        this.setState({loading: true});
        const {searchTitle, page, pageSize} = this.state;
        const params = this.getRequestParams(searchTitle, page, pageSize);

        TrnscUserGroupService.getAll(params)
                .then((res) => {
                    //alert(JSON.stringify(res.data));
                    const {objs, totalPages} = res.data;
                    this.setState({
                        loading: false,
                        objs: objs,
                        count: totalPages,
                    });
                    console.log(res.data);
                })
                .catch((e) => {
                    //alert(e);

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
        TrnscUserGroupService.get(id)
                .then((res) => {
                    //alert(JSON.stringify(res.data));
                    var mmm = res.data;
                    /*var nwLins = [];
                    for (var i = 0; i < mmm.lines.length; i++) {
                        var onLine = mmm.lines[i];
                        var nam = this.state.authUsers.filter(x => x.value === onLine.auth_user_id)[0].label;

                        // var xxx = this.state.currObj;
                        onLine['name'] = nam;
                        onLine['_index'] = i;

                        nwLins.push(onLine);
                    }
                    mmm['lines'] = nwLins;
                    // alert(JSON.stringify(mmm));
*/

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

    handleChangeIsUserActChk = (e) => {
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    active: !this.state.currDetObj['active']
                }
            }));
    }

    handleChangeTrnscType = (e) => {
        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
                currObj: {
                    ...prevState.currObj,
                   
                     lookupDetailTrnscType: {id: val.value, code: val.label}
                }
            }));
    }

    handleChangeUserSel = (e) => {
        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                  
                    authUser: {id: val.value, code: val.label}
                }
            }));
    }

    handleChangeIsActChk = (e) => {
//var xxx = this.state.currObj;
//xxx['active'] = ! this.state.currObj['active'];
//this.setState({currObj: xxx});

        this.setState(prevState => ({
                currObj: {
                    ...prevState.currObj,
                    active: !this.state.currObj['active']
                }
            }));
    }

    onClickSaveUpdate = () => {
        this.setState({loading: true});
        //alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            TrnscUserGroupService.create(
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

            TrnscUserGroupService.update(
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
        TrnscUserGroupService.delete(this.state.currObj.id)
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
            currObj: {lookupDetailTrnscType: null, active: false, lines: []}
        });
    }

    onClickClearDet = () => {
        this.setState({
            currDetObj: {},
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
            this.setState({currObj: xxx, currDetObj: {}});
        } else {

            var xxx = this.state.currObj;
            var ttt = xxx['lines'];
            var ppp = ttt.splice(obbb._index, 1);
            xxx['lines'] = ttt;
//              alert(JSON.stringify(xxx));
            this.setState({currObj: xxx, currDetObj: {}});
        }
    }

    onClickAddAmendDet = () => {

        var obbb = this.state.currDetObj;

        if (Object.keys(this.state.currDetObj).length === 0) {
            alert("Choose User");
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
            
            var nam = this.state.authUsers.filter(x => obbb.authUser && x.value === obbb.authUser.id)[0].label;
            //obbb['name'] = nam;
            obbb['authUser'] = {id: obbb.authUser.id, name: nam};



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
            var nam = this.state.authUsers.filter(x => obbb.authUser && x.value === obbb.authUser.id)[0].label;
            obbb['authUser'] = {id: obbb.authUser.id, name: nam};

            ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'UPDATED'} : el);
        }
        xxx['lines'] = ggg;
        //alert(JSON.stringify(xxx));
        this.setState({currObj: xxx, currDetObj: {}});
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
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
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Transaction User Group</h3>
                
                    <div className="containerx">
                
                        <div className="list row">
                            <div className="col-md-6">
                
                                <div className="input-group mb-3">
                
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Name"
                                        value={searchTitle}
                                        onChange={this.onChangeSearchTitle}
                                        />
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
                                <div className="mt-3">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.clear}
                                        >
                                        Add New
                                    </button>
                
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
                
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">Transaction Type</th>
                                            <th scope="col">Active?</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                
                                        {objs &&
                                                    objs.map((obj, index) => (
                                                <tr>                                            
                        
                        
                                                    <td>{obj.lookupDetailTrnscType.code}</td>
                        
                                                    <td>{obj.active ? 'Yes' : 'No'}</td>
                        
                                                    <td>
                                                        <button name={obj.id}
                                                                type="button"
                                                                className="btn btn-success"
                                                                onClick={(e) => this.onClickLoadForm(e.target.name)}
                                                                >
                                                            Load
                                                        </button>
                        
                                                    </td>
                                                </tr>))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                
                                <div>
                                    {currObj ? (
                                    <div className="edit-form">
                                        <form>
                
                                            <div className="form-group">
                                                <label htmlFor="userx">Transaction Type</label>
                
                                                <div className="form-group">
                                                    <Select id="userx" options={this.state.lookup_details_dd} 
                                                    
                                                            values={this.state.lookup_details_dd.filter(z => currObj.lookupDetailTrnscType && z.value === currObj.lookupDetailTrnscType.id)} 
                                            
                                                            onChange={v => this.handleChangeTrnscType(v[0])} />
                                                </div>
                                            </div>
                
                
                
                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currObj.active}  onChange={this.handleChangeIsActChk} />
                                                    <span>Active?</span>
                                                </label>
                                            </div>
                
                                        </form>
                                        {currObj.id ?
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={this.deleteAlert}
                                    
                                                                >
                                                                Delete
                                                            </button>
                                                                        : null}
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            onClick={this.onClickSaveUpdate}
                
                                            >
                                            {currObj.id ? 'Update' : 'Save'}
                                        </button>
                                        <p>{this.state.message}</p>
                
                                        <h5>Add/Remove Details</h5>
                
                                        <div className="detail-form">
                
                                            <div className="form-group">
                                                <label htmlFor="user">User</label>
                
                                                <div className="form-group">
                                                   <Select id="user" options={this.state.authUsers} 
                                                            values={this.state.authUsers.filter(z => this.state.currDetObj.authUser && z.value === this.state.currDetObj.authUser.id)} 
                                                            onChange={v => this.handleChangeUserSel(v[0])} />                             
                                                </div>
                                            </div>
                
                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currDetObj.active}  
                                                           onChange={this.handleChangeIsUserActChk} />
                                                    <span>User Active?</span>
                                                </label>
                                            </div>
                                        </div>
                
                
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
                
                
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                
                                                    <th scope="col">User Name</th>
                                                    <th scope="col">Active?</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                
                                                {currObj.lines &&
                                                                                currObj.lines.map((obj, index) => (
                                                                        <tr>                                            
                                        
                                        
                                                                            <td>{obj.authUser.name}</td>
                                                                            <td>{obj.active ? 'Yes' : 'No'}</td>
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
                                                ) : (
                                    <div>
                                        <br />
                                        <p>Please click on a User Group...</p>
                                    </div>
                                                )}
                                </div>
                            </div>
                        </div>
                
                    </div>
                </Layout>

                );
    }
}