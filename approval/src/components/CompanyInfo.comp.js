import React, { Component } from "react";
import CompanyInfoService from "../services/CompanyInfo.service";
import AuthService from "../services/Auth.service";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";

export default class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.clear = this.clear.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveObjs = this.retrieveObjs.bind(this);
        this.onClickLoadForm = this.onClickLoadForm.bind(this);
        this.onChangeIsActive = this.onChangeIsActive.bind(this);
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

        CompanyInfoService.getAll(params)
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
        CompanyInfoService.get(id)
                .then((res) => {
                 //   alert(JSON.stringify(res.data));
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


//        this.setState(prevState => ({
//                currObj: {
//                    ...prevState.currObj,
//                    active: !this.state.currObj['active']
//                }
//            }));
    }

    onClickSaveUpdate = () => {
        this.setState({loading: true});
        //alert(JSON.stringify(this.state.currObj));

        if (this.state.currObj.id === undefined) {
            CompanyInfoService.create(
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

            CompanyInfoService.update(
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
        CompanyInfoService.delete(this.state.currObj.id)
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
            currObj: {code: '', companyName: '',
                active: true}
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
                
                    <h3>Company Info</h3>
                
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
                                                    <th scope="col">Company Name</th>
                                                    <th scope="col">Active?</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                
                                                {objs &&
                                                            objs.map((obj, index) => (
                                                <tr>                                            
                                                    <td>{obj.code}</td>
                                                    <td>{obj.companyName}</td>
                                                    {/*<td>{obj.displayName}</td>*/}
                                                    {/*<td>{obj.mobile}</td>*/}
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
                                                    <label htmlFor="companyName">Company Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="companyName"
                                                        name="companyName"
                                                        value={currObj.companyName}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        />
                                                </div>
                                            </div>
                    
                                            {/*<div class="col-sm-6">*/}

                                                {/*<div className="form-group">*/}
                                                    {/*<label htmlFor="displayName">Display Name</label>*/}
                                                    {/*<input*/}
                                                        {/*type="text"*/}
                                                        {/*className="form-control"*/}
                                                        {/*id="displayName"*/}
                                                        {/*name="displayName"*/}
                                                        {/*value={currObj.displayName}*/}
                                                        {/*onChange={this.myChangeHandlerOfCurrObj}*/}
                                                        {/*/>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                    
                    

                    
                    


                    
                    
                    
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
                                        <p>Please click on a Company...</p>
                                    </div>
                                            )}
                            </div>
                
                        </div>
                
                    </div>
                </Layout>

                );
    }
}