import React, { Component } from "react";
import AmeService from "../services/Ame.service";
import AmeCondiService from "../services/AmeCondi.service";
import AmeGroupService from "../services/AmeGroup.service";
import AuthService from "../services/Auth.service";
import { Redirect, Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class Ame extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.onClickAddAmendDet = this.onClickAddAmendDet.bind(this);
        this.retrieveAmeGroupObjs = this.retrieveAmeGroupObjs.bind(this);
        this.retrieveAmeCondiObjs = this.retrieveAmeCondiObjs.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onClickRemoveDet = this.onClickRemoveDet.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onClickLoadDet = this.onClickLoadDet.bind(this);
        this.handleChangeIsUserActChk = this.handleChangeIsUserActChk.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeSlNo = this.onChangeSlNo.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeRemarks = this.onChangeRemarks.bind(this);
        this.handleChangeIsActChk = this.handleChangeIsActChk.bind(this);
        this.handleChangeIsActChkDet = this.handleChangeIsActChkDet.bind(this);
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.state = {
            redirect: null,
            loading: false,
            objs: [],
            ameCondis: [],
            ameGroups: [],
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
        this.retrieveAmeGroupObjs();
        this.retrieveAmeCondiObjs();
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

    retrieveAmeCondiObjs = () => {

        this.setState({loading: true});
        AmeCondiService.getAllMinimal()
                .then((res) => {
                    // alert(JSON.stringify(res.data));
                    console.log(res.data);
                    this.setState({
                        loading: false,
                        ameCondis: res.data,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    /// alert(JSON.stringify(e));

                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
    }

    retrieveAmeGroupObjs = () => {

        this.setState({loading: true});
        AmeGroupService.getAllMinimal()
                .then((res) => {
                    // alert(JSON.stringify(res.data));
                    console.log(res.data);
                    this.setState({
                        loading: false,
                        ameGroups: res.data,
                    });
                })
                .catch((e) => {
                    console.log(e);
                    /// alert(JSON.stringify(e));

                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;
                });
    }

    retrieveObjs = () => {
        this.setState({loading: true});
        const {searchTitle, page, pageSize} = this.state;
        const params = this.getRequestParams(searchTitle, page, pageSize);
        AmeService.getAll(params)
                .then((res) => {
                    //  alert(JSON.stringify(res.data));
                    const {objs, totalPages} = res.data;
                    this.setState({
                        loading: false,
                        objs: objs,
                        count: totalPages,
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
        AmeService.get(id)
                .then((res) => {
              //      alert(JSON.stringify(res.data));
                    var mmm = res.data;
//                    var nwLins = [];
//                    for (var i = 0; i < mmm.lines.length; i++) {
//                        var onLine = mmm.lines[i];
//                        var nam = this.state.ameCondis.filter(x => x.value === onLine.ameCondi)[0].label;
//
//                        // var xxx = this.state.currObj;
//                        onLine['name'] = nam;
//                        onLine['_index'] = i;
//
//                        nwLins.push(onLine);
//                    }
//                    mmm['lines'] = nwLins;
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

    handleChangeIsUserActChk = (e) => {
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    active: !this.state.currDetObj['active']
                }
            }));
    }

    handleChangeAmeCondi = (e) => {
        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    ameCondi: {id: val.value, code: val.label}
                }
            }));
    }

    handleChangeAmeGroup = (e) => {
        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    ameGroup: {id: val.value, code: val.label}
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

    handleChangeIsActChkDet = (e) => {
//var xxx = this.state.currObj;
//xxx['active'] = ! this.state.currObj['active'];
//this.setState({currObj: xxx});

        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    active: !this.state.currDetObj['active']
                }
            }));
    }

    onChangeDescription = (e) => {
        const description = e.target.value;
        this.setState(prevState => ({
                currObj: {
                    ...prevState.currObj,
                    description: description
                }
            }));
    }

    onChangeRemarks = (e) => {
        const description = e.target.value;
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    remarks: description
                }
            }));
    }

    onChangeSlNo = (e) => {
        const description = e.target.value;
        this.setState(prevState => ({
                currDetObj: {
                    ...prevState.currDetObj,
                    slNo: description
                }
            }));
    }

    onChangeTitle = (e) => {
        const description = e.target.value;
        this.setState(prevState => ({
                currObj: {
                    ...prevState.currObj,
                    description: description
                }
            }));
    }

    onClickSaveUpdate = () => {
        this.setState({loading: true});
        //alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            AmeService.create(
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

            AmeService.update(
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
        AmeService.delete(this.state.currObj.id)
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
            currObj: {description: '', active: true, lines: []}
        });
    }

    onClickClearDet = () => {
        this.setState({
            currDetObj: {slNo: '', remarks: ''},
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
            this.setState({currObj: xxx, currDetObj: {slNo: '', remarks: ''}});
        } else {

            var xxx = this.state.currObj;
            var ttt = xxx['lines'];
            var ppp = ttt.splice(obbb._index, 1);
            xxx['lines'] = ttt;
//              alert(JSON.stringify(xxx));
            this.setState({currObj: xxx, currDetObj: {slNo: '', remarks: ''}});
        }
    }

    onClickAddAmendDet = () => {

        var obbb = this.state.currDetObj;
        if (Object.keys(this.state.currDetObj).length === 0) {
            alert("Choose Condition");
            return;
        }

//alert(JSON.stringify(obbb));
        var ggg;
        var xxx = this.state.currObj;
        if (obbb.id === undefined) {

            ggg = xxx['lines'];
            if (ggg === undefined)
                ggg = [];

            var nam = this.state.ameCondis.filter(x => obbb.ameCondi && x.value === obbb.ameCondi.id)[0].label;
            obbb['ameCondi'] = {id: obbb.ameCondi.id, description: nam};

            nam = this.state.ameGroups.filter(x => obbb.ameGroup && x.value === obbb.ameGroup.id)[0].label;
            obbb['ameGroup'] = {id: obbb.ameGroup.id, description: nam};

            if (obbb['_mode'] === undefined) {
                obbb['_mode'] = 'NEW';
                obbb['_index'] = ggg.length;

                ggg.push(obbb);
            } else {
                ggg = xxx['lines'].map(el => el._index === obbb._index ? {...el, ...obbb, _mode: 'NEW_UPDATED'} : el);
            }

        } else {
            var nam = this.state.ameCondis.filter(x => obbb.ameCondi && x.value === obbb.ameCondi.id)[0].label;
            obbb['ameCondi'] = {id: obbb.ameCondi.id, description: nam};

            nam = this.state.ameGroups.filter(x => obbb.ameGroup && x.value === obbb.ameGroup.id)[0].label;
            obbb['ameGroup'] = {id: obbb.ameGroup.id, description: nam};

            ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'UPDATED'} : el);
        }
        xxx['lines'] = ggg;
        //alert(JSON.stringify(xxx));
        this.setState({currObj: xxx, currDetObj: {slNo: '', remarks: ''}});
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
                
                    <h3>Master Setup</h3>
                
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
                                            <th scope="col">Master Title</th>
                                            <th scope="col">Active?</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                
                                        {objs &&
                                                    objs.map((obj, index) => (
                                                <tr>                                            
                        
                                                    <td>{obj.description}</td>
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
                                                <label htmlFor="name">Master Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    value={currObj.description}
                                                    onChange={this.onChangeTitle}
                                                    />
                                            </div>
                
                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currObj.active}
                                                           onChange={this.handleChangeIsActChk} />
                                                    <span>Active???</span>
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
                                                <label htmlFor="name">SL No*</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="slNo"
                                                    value={this.state.currDetObj.slNo}
                                                    onChange={this.onChangeSlNo}
                                                    />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Group</label>
                
                                                <div className="form-group">
                                                    <Select id="user" options={this.state.ameGroups} 
                                                            values={this.state.ameGroups.filter(z => this.state.currDetObj.ameGroup && z.value === this.state.currDetObj.ameGroup.id)} 
                                                            onChange={v => this.handleChangeAmeGroup(v[0])} />                             
                                                </div>
                
                                            </div>
                
                                            <div className="form-group">
                                                <label htmlFor="description">Condition</label>
                
                
                                                <div className="form-group">
                                                    <Select id="user" options={this.state.ameCondis} 
                                                            values={this.state.ameCondis.filter(z => this.state.currDetObj.ameCondi && z.value === this.state.currDetObj.ameCondi.id)} 
                                                            onChange={v => this.handleChangeAmeCondi(v[0])} />                             
                                                </div>
                
                                            </div>
                
                


                
                
                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currDetObj.active}  
                                                           onChange={this.handleChangeIsActChkDet} />
                                                    <span>Active?</span>
                                                </label>
                                            </div>
                                        </div>
                
                                        <button
                                            className={'btn btn-primary'}
                
                                            type="button"
                                            onClick={this.onClickAddAmendDet}
                                            >
                                            { this.state.currObj.lines && (this.state.currObj.lines.length == 0 || Object.keys(this.state.currDetObj).length == 0) ? 'Add' : 'Amend'}
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
                
                                                    <th scope="col">SL</th>
                                                    <th scope="col">Group</th>
                                                    <th scope="col">Condition</th>
                                                    <th scope="col">Active?</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                
                                                {currObj.lines &&
                                                                                currObj.lines.map((obj, index) => (
                                                                        <tr>
                                        
                                                                            <td>{obj.slNo}</td>
                                                                            <td>{obj.ameGroup.description}</td>
                                                                            <td>{obj.ameCondi.description}</td>
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