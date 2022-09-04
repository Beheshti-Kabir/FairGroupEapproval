import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import Layout from "./Layout.comp";
import { Redirect } from "react-router-dom";
import Loading from 'react-fullscreen-loading';
import AuthService from "../services/Auth.service";

export default class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getTutorial = this.getTutorial.bind(this);
        this.updatePublished = this.updatePublished.bind(this);
        this.updateTutorial = this.updateTutorial.bind(this);
        this.deleteTutorial = this.deleteTutorial.bind(this);

        this.state = {
            redirect: null,
            currentTutorial: {
                id: null,
                title: "",
                description: "",
                published: false
            },
            message: ""
        };
    }

    componentDidMount() {
         if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        this.getTutorial(this.props.match.params.id);
    }

    onChangeTitle(e) {
        const title = e.target.value;

        this.setState(function (prevState) {
            return {
                currentTutorial: {
                    ...prevState.currentTutorial,
                    title: title
                }
            };
        });
    }

    onChangeDescription(e) {
        const description = e.target.value;

        this.setState(prevState => ({
                currentTutorial: {
                    ...prevState.currentTutorial,
                    description: description
                }
            }));
    }

    getTutorial(id) {
        this.setState({loading: true});

        TutorialDataService.get(id)
                .then(response => {
                    //alert(response.data);
                    this.setState({
                        loading: false,
                        currentTutorial: response.data
                    });
                    console.log(response.data);
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});

                });
    }

    updatePublished(status) {
        var data = {
            id: this.state.currentTutorial.id,
            title: this.state.currentTutorial.title,
            description: this.state.currentTutorial.description,
            published: status
        };

        this.setState({loading: true});

        TutorialDataService.update(this.state.currentTutorial.id, data)
                .then(response => {
                    this.setState(prevState => ({
                            currentTutorial: {
                                ...prevState.currentTutorial,
                                published: status
                            }
                        }));
                    this.setState({loading: false});

                    console.log(response.data);
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});

                });
    }

    updateTutorial() {
        this.setState({loading: true});

        TutorialDataService.update(
                this.state.currentTutorial.id,
                this.state.currentTutorial
                )
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        loading: false,
                        message: "The tutorial was updated successfully!"
                    });
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});

                });
    }

    deleteTutorial() {
        this.setState({loading: true});

        TutorialDataService.delete(this.state.currentTutorial.id)
                .then(response => {
                    this.setState({loading: false});

                    console.log(response.data);
                    this.props.history.push('/tutorials_list')
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});

                });
    }

    render() {
        
          if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const {currentTutorial} = this.state;

        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Tutorials Edit</h3>
                
                    <div className="containerx">
                
                        <div>
                            {currentTutorial ? (
                                            <div className="edit-form">
                                                <form>
                                                    <div className="form-group">
                                                        <label htmlFor="title">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="title"
                                                            value={currentTutorial.title}
                                                            onChange={this.onChangeTitle}
                                                            />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="description">Description</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="description"
                                                            value={currentTutorial.description}
                                                            onChange={this.onChangeDescription}
                                                            />
                                                    </div>
                                
                                                    <div className="form-group">
                                                        <label>
                                                            <strong>Status:</strong>
                                                        </label>
                                                        {currentTutorial.published ? "Published" : "Pending"}
                                                    </div>
                                                </form>
                                
                                                {currentTutorial.published ? (
                                                                                    <button
                                                                                        className="badge badge-primary mr-2"
                                                                                        onClick={() => this.updatePublished(false)}
                                                                                        >
                                                                                        UnPublish
                                                                                    </button>
                                                                                ) : (
                                                                            <button
                                                                                className="badge badge-primary mr-2"
                                                                                onClick={() => this.updatePublished(true)}
                                                                                >
                                                                                Publish
                                                                            </button>
                                                                        )}
                                
                                                <button
                                                    className="badge badge-danger mr-2"
                                                    onClick={this.deleteTutorial}
                                                    >
                                                    Delete
                                                </button>
                                
                                                <button
                                                    type="submit"
                                                    className="badge badge-success"
                                                    onClick={this.updateTutorial}
                                                    >
                                                    Update
                                                </button>
                                                <p>{this.state.message}</p>
                                            </div>
                                                ) : (
                                    <div>
                                        <br />
                                        <p>Please click on a Tutorial...</p>
                                    </div>
                                        )}
                        </div>
                    </div> 
                </Layout>

                );
    }
}
