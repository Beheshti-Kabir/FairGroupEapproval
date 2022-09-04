import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';

export default class TutorialForm extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveTutorial = this.saveTutorial.bind(this);
        this.newTutorial = this.newTutorial.bind(this);

        this.state = {
            id: null,
            title: "",
            description: "",
            published: false,

            submitted: false
        };
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    saveTutorial() {
        var data = {
            title: this.state.title,
            description: this.state.description
        };
        this.setState({loading: true});

        TutorialDataService.create(data)
                .then(response => {
                    this.setState({
                        id: response.data.id,
                        title: response.data.title,
                        description: response.data.description,
                        published: response.data.published,
                        loading: false,
                        submitted: true
                    });
                    console.log(response.data);
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});

                });
    }

    newTutorial() {
        this.setState({
            id: null,
            title: "",
            description: "",
            published: false,

            submitted: false
        });
    }

    render() {
        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Tutorials Entry</h3>
                
                    <div className="containerx">
                
                        <div className="submit-form">
                            {this.state.submitted ? (
                                            <div>
                                                <h4>You Added successfully!</h4>
                                                <button className="btn btn-success" onClick={this.newTutorial}>
                                                    Add
                                                </button>
                                            </div>
                                                ) : (
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                required
                                                value={this.state.title}
                                                onChange={this.onChangeTitle}
                                                name="title"
                                                />
                                        </div>
                        
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                required
                                                value={this.state.description}
                                                onChange={this.onChangeDescription}
                                                name="description"
                                                />
                                        </div>
                        
                                        <button onClick={this.saveTutorial} className="btn btn-success">
                                            Add
                                        </button>
                                    </div>
                                        )}
                        </div>
                    </div> 
                </Layout>

                );
    }
};
