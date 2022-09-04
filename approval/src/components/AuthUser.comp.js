import React, { Component } from "react";
import AuthUserService from "../services/AuthUser.service";
import AuthService from "../services/Auth.service";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class AuthUser extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onChangeIsActive = this.onChangeIsActive.bind(this);
        this.onChangeIndDepnd=this.onChangeIndDepnd.bind(this);
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            redirect: null,
            loading: false,
            objs: [],
            currObj: null,
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

    retrieveObjs = () => {
        this.setState({loading: true});
        const {searchTitle, page, pageSize} = this.state;
        const params = this.getRequestParams(searchTitle, page, pageSize);

        AuthUserService.getAll(params)
                .then((res) => {
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

    onClickLoadForm = (id) => {
      //  alert(JSON.stringify(id));

        this.setState({
            loading: true,
            //   message: undefined
        });
        AuthUserService.get(id)
                .then((res) => {
               //     alert(JSON.stringify(res.data));
                    var mmm = res.data;

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

    myChangeHandlerOfCurrObj = (e) => {
        var nam = e.target.name;
        var val = e.target.value;

        //this.setState({[nam]: val});
        //alert(JSON.stringify(abc));

        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    ...{[nam]: val}
                }
            };
        });
    }

    onChangeIsActive = (e) => {


        var nam = e.target.name;
        var val = e.target.value;

//var xxx = this.state.currObj;
//xxx['active'] = ! this.state.currObj['active'];
//this.setState({currObj: xxx});


        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    ...{[nam]: !this.state.currObj[nam]}
                }
            };
        });


    }

onChangeIndDepnd = (e) => {
        const val = e.target.value;
        alert(val);

        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    userType: val
                }
            };
        });
    }


    onClickSaveUpdate = () => {
        this.setState({loading: true});
        //alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            AuthUserService.create(
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

            AuthUserService.update(
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
        AuthUserService.delete(this.state.currObj.id)
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
            currObj: {code: '', fullName: '', displayName: '',
                email: '', mobile: '',userType:'',userTypeList:'',
                active: false}
        });
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
                
                    <h3>User</h3>
                
                    <div className="xcontainer">
                
                        <div className="row">
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
                
                                <div className="row">
                
                                    <div class="col-sm-12 p-1">
                
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Full Name</th>
                                                    <th scope="col">Display Name</th>
                                                    <th scope="col">Mobile</th>
                                                    <th scope="col">Active?</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                
                                                {objs &&
                                                            objs.map((obj, index) => (
                                                <tr>                                            
                                                    <td>{obj.code}</td>
                                                    <td>{obj.fullName}</td>
                                                    <td>{obj.displayName}</td>
                                                    <td>{obj.mobile}</td>
                                                    <td>{obj.active ? 'Yes' : 'No'}</td>
                
                                                    <td>
                                                        <button name = {obj.id}
                
                                                                type = "button"
                                                                className="btn btn-primary"
                                                                onClick={(e) => this.onClickLoadForm(e.target.name)}
                
                                                                >
                                                            Load
                                                        </button>
                
                                                    </td>
                                                </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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
                                                        name="code"
                                                        value={currObj.code}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                    
                                            </div>
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label htmlFor="fullName">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={currObj.fullName}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>
                    
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label htmlFor="displayName">Display Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="displayName"
                                                        name="displayName"
                                                        value={currObj.displayName}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>
                    
                    
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        value={currObj.email}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>   
                    
                    
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label htmlFor="mobile">Mobile</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="mobile"
                                                        name="mobile"
                                                        value={currObj.mobile}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>
                    
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        value={currObj.password}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>

                                    <div class="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="userTypeList">User Type</label>


                                                                <select id="type" className="form-control"
                                                                        onChange={e => this.onChangeIndDepnd(e)}
                                                                        value={currObj.userType}>
                                                                    <option value="">Select One</option>
                                                                    <option value="USER">User</option>
                                                                    <option value="APPROVER">Approver</option>
                                                                    <option value="ADMIN">Admin</option>
                                                                </select>

                                                            </div>
                                                        </div>
                    
                                            <div class="col-sm-6">
                    
                                                <div className="form-group">
                                                    <label>
                                                        <input type="checkbox" name="active" checked={this.state.currObj.active}  onChange={this.onChangeIsActive} />
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
                                    </div>
                                            ) : (
                                    <div>
                                        <br />
                                        <p>Please click on a User...</p>
                                    </div>
                                            )}
                            </div>
                
                        </div>
                
                    </div>
                </Layout>

                );
    }
}