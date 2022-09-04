import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import { Redirect, Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import AuthService from "../services/Auth.service";

export default class TutorialsList extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveTutorials = this.retrieveTutorials.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTutorial = this.setActiveTutorial.bind(this);

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            redirect: null,
            loading: false,
            tutorials: [],
            currentTutorial: null,
            currentIndex: -1,
            searchTitle: "",

            page: 1,
            count: 0,
            pageSize: 3,
        };

        this.pageSizes = [3, 6, 9];
    }

    componentDidMount() {
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        this.retrieveTutorials();
    }

    onChangeSearchTitle(e) {
        const searchTitle = e.target.value;

        this.setState({
            searchTitle: searchTitle,
        });
    }

    getRequestParams(searchTitle, page, pageSize) {
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

    retrieveTutorials() {

        const {searchTitle, page, pageSize} = this.state;
        const params = this.getRequestParams(searchTitle, page, pageSize);
        this.setState({loading: true});
        TutorialDataService.getAll(params)
                .then((response) => {
                    //alert(JSON.stringify(response.data));
                    const {tutorials, totalPages} = response.data;
                    this.setState({
                        loading: false,
                        tutorials: tutorials,
                        count: totalPages,
                    });
                    console.log(response.data);
                })
                .catch((e) => {
                    console.log(e);
                    this.setState({
                        loading: false
                    });
                    // this.state.loading = false;

                });
    }

    refreshList() {
        this.retrieveTutorials();
        this.setState({
            currentTutorial: null,
            currentIndex: -1,
        });
    }

    setActiveTutorial(tutorial, index) {
        this.setState({
            currentTutorial: tutorial,
            currentIndex: index,
        });
    }

    handlePageChange(event, value) {
        this.setState(
                {
                    page: value,
                },
                () => {
            this.retrieveTutorials();
        }
        );
    }

    handlePageSizeChange(event) {
        this.setState(
                {
                    pageSize: event.target.value,
                    page: 1
                },
                () => {
            this.retrieveTutorials();
        }
        );
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        
        const {
            searchTitle,
            tutorials,
            currentTutorial,
            currentIndex,
            page,
            count,
            pageSize,
        } = this.state;

//<!--<Loading loading=this.state.loading background="#2ecc71" loaderColor="#3498db" />-->

        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Tutorials List</h3>
                
                    <div className="containerx">
                
                        <div className="list row">
                            <div className="col-md-8">
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by title"
                                        value={searchTitle}
                                        onChange={this.onChangeSearchTitle}
                                        />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={this.retrieveTutorials}
                                            >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                
                                <div className="mt-3">
                                    {"Items per Page: "}
                                    <select onChange={this.handlePageSizeChange} value={pageSize}>
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
                
                                <ul className="list-group">
                                    {tutorials &&
                            tutorials.map((tutorial, index) => (
                                                                    <li
                                                                        className={
                                                                        "list-group-item " +
                                                                                                        (index === currentIndex ? "active" : "")
                                                                        }
                                                                        onClick={() => this.setActiveTutorial(tutorial, index)}
                                                                        key={index}
                                                                        >
                                                                        {tutorial.title}
                                                                    </li>
                                        ))}
                                </ul>
                
                
                
                                <a href="/tutorials_add" className="btn btn-primary" >Add New</a>
                
                            </div>
                            <div className="col-md-6">
                                {currentTutorial ? (
                                    <div>
                                        <h4>Tutorial</h4>
                                        <div>
                                            <label>
                                                <strong>Title:</strong>
                                            </label>{" "}
                                            {currentTutorial.title}
                                        </div>
                                        <div>
                                            <label>
                                                <strong>Description:</strong>
                                            </label>{" "}
                                            {currentTutorial.description}
                                        </div>
                                        <div>
                                            <label>
                                                <strong>Status:</strong>
                                            </label>{" "}
                                            {currentTutorial.published ? "Published" : "Pending"}
                                        </div>
                    
                                        <Link
                                            to={"/tutorials/" + currentTutorial.id}
                                            className="badge badge-warning"
                                            >
                                        Edit
                                        </Link>
                                    </div>
                            ) : (
                                                    <div>
                                                        <br />
                                                        <p>Please click on a Tutorial...</p>
                                                    </div>
                            )}
                            </div>
                        </div>
                
                    </div> 
                </Layout>

                );
    }
}
