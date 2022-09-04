import React, {Component} from "react";
import AmeConditionService from "../services/AmeCondition.service";
import AuthUserService from "../services/AuthUser.service";
import AuthService from "../services/Auth.service";
import {Redirect, Link} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class AmeCondition extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.onClickAddAmendDet = this.onClickAddAmendDet.bind(this);
        this.retrieveAuthUserObjs = this.retrieveAuthUserObjs.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onClickRemoveDet = this.onClickRemoveDet.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onClickLoadDet = this.onClickLoadDet.bind(this);
        this.handleChangeIsUserActChk = this.handleChangeIsUserActChk.bind(this);
        this.handleChangeUserSel = this.handleChangeUserSel.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeCondiSql = this.onChangeCondiSql.bind(this);
        this.onChangeCondiSl = this.onChangeCondiSl.bind(this);
        this.handleChangeIsActChk = this.handleChangeIsActChk.bind(this);
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            redirect: null,
            loading: false,
            objs: [],
            authUsers: [],
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

    retrieveAuthUserObjs = () => {

        this.setState({loading: true});
        AuthService.getAllMinimal()
            .then((res) => {
                // alert(JSON.stringify(res.data));
                console.log(res.data);

                this.setState({
                    loading: false,
                    authUsers: res.data,
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

        AmeConditionService.getAll(params)
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

        this.setState({
            loading: true,
        });
        AmeConditionService.get(id)
            .then((res) => {
                //alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    currObj: res.data,
                    currDetObj: {active: false, condiSlNo: '', condiSql: ''}
                });

            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    loading: false
                });
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

    onChangeDescription = (e) => {
        const description = e.target.value;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                description: description
            }
        }));
    }

    onChangeCondiSql = (e) => {
        const condiSql = e.target.value;
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                condiSql: condiSql
            }
        }));
    }

    onChangeCondiSl = (e) => {
        const condiSlNo = e.target.value;
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                condiSlNo: condiSlNo
            }
        }));
    }

    onChangeTitle = (e) => {
        const condiDescription = e.target.value;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                condiDescription: condiDescription
            }
        }));
    }

    onClickSaveUpdate = () => {
        this.setState({loading: true});
        alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            AmeConditionService.create(
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

            AmeConditionService.update(
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
        AmeConditionService.delete(this.state.currObj.id)
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
            currObj: {condiDescription: '', description: '', active: true, lines: []}
        });
    }

    onClickClearDet = () => {
        this.setState({
            currDetObj: {active: false, condiSlNo: '', condiSql: ''}
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
            this.setState({currObj: xxx, currDetObj: {active: false, condiSlNo: '', condiSql: ''}});
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

            //var nam = this.state.authUsers.filter(x => obbb.authUser && x.value === obbb.authUser.id)[0].label;
            //obbb['authUser'] = {id: obbb.authUser.id, name: nam};

            if (obbb['_mode'] === undefined) {
                obbb['_mode'] = 'NEW';
                obbb['_index'] = ggg.length;

                ggg.push(obbb);
            } else {
                ggg = xxx['lines'].map(el => el._index === obbb._index ? {...el, ...obbb, _mode: 'NEW_UPDATED'} : el);
            }

        } else {
            // var nam = this.state.authUsers.filter(x => obbb.authUser && x.value === obbb.authUser.id)[0].label;
            // obbb['authUser'] = {id: obbb.authUser.id, name: nam};

            ggg = xxx['lines'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'UPDATED'} : el);
        }
        xxx['lines'] = ggg;
        //alert(JSON.stringify(xxx));
        this.setState({currObj: xxx, currDetObj: {active: false, condiSlNo: '', condiSql: ''}});
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

                <h3>Condition Setup</h3>

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
                                    ))}A
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
                                    <th scope="col">Condition Title</th>
                                    {/*<th scope="col">Description</th>*/}
                                    <th scope="col">Active?</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>

                                {objs &&
                                objs.map((obj, index) => (
                                    <tr>

                                        <td>{obj.condiDescription}</td>
                                        {/*<td>{obj.description}</td>*/}
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
                                                <label htmlFor="name">Condition Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="condiDescription"
                                                    value={currObj.condiDescription}
                                                    onChange={this.onChangeTitle}
                                                />
                                            </div>
                                            {/*<div className="form-group">*/}
                                            {/*<label htmlFor="description">Description</label>*/}
                                            {/*<input*/}
                                            {/*type="text"*/}
                                            {/*className="form-control"*/}
                                            {/*id="description"*/}
                                            {/*value={currObj.description}*/}
                                            {/*onChange={this.onChangeDescription}*/}
                                            {/*/>*/}
                                            {/*</div>*/}

                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currObj.active}
                                                           onChange={this.handleChangeIsActChk}/>
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

                                            {/*<div className="form-group">*/}
                                            {/*<label htmlFor="user">User</label>*/}

                                            {/*<div className="form-group">*/}
                                            {/*<Select id="user" options={this.state.authUsers} */}
                                            {/*values={this.state.authUsers.filter(z => this.state.currDetObj.authUser && z.value === this.state.currDetObj.authUser.id)} */}

                                            {/*onChange={v => this.handleChangeUserSel(v[0])} />*/}
                                            {/*</div>*/}
                                            {/*</div>*/}
                                            <div className="form-group">
                                                <label htmlFor="name">Condition SL *</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="condiSlNo"
                                                    value={this.state.currDetObj.condiSlNo}
                                                    onChange={this.onChangeCondiSl}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="codiSql">Condition SQL</label>
                                                {/*<input*/}
                                                {/*type="text"*/}
                                                {/*className="form-control"*/}
                                                {/*id="condiSql"*/}
                                                {/*value={this.state.currDetObj.condiSql}*/}
                                                {/*onChange={this.onChangeDescription}*/}
                                                {/*/>*/}
                                                <textarea className="form-control" id="condiSql" rows="3" cols="60"
                                                          value={this.state.currDetObj.condiSql}
                                                          onChange={this.onChangeCondiSql}></textarea>
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" checked={this.state.currDetObj.active}
                                                           onChange={this.handleChangeIsUserActChk}/>
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
                                                <th scope="col">Condition SQL</th>
                                                <th scope="col">Active?</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {currObj.lines &&
                                            currObj.lines.map((obj, index) => (
                                                <tr>

                                                    <td>{obj.condiSlNo}</td>
                                                    <td>{obj.condiSql}</td>
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