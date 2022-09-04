import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import Layout from "./Layout.comp";
import AuthService from "../services/Auth.service";

const required = value => {
    if (!value) {
        return (
                <div className="alert alert-danger" role="alert">
                    This field is required!
                </div>
                );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
                <div className="alert alert-danger" role="alert">
                    This is not a valid email.
                </div>
                );
    }
};

const vdisplayName = value => {
    if (value.length < 3 || value.length > 20) {
        return (
                <div className="alert alert-danger" role="alert">
                    The displayName must be between 3 and 15 characters.
                </div>
                );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
                <div className="alert alert-danger" role="alert">
                    The username must be between 3 and 20 characters.
                </div>
                );
    }
};

const vmobile = value => {
    if (value.length < 13 || value.length > 16) {
        return (
                <div className="alert alert-danger" role="alert">
                    The mobile must be between 13 and 16 characters. use + and ISD Code.
                </div>
                );
    }
};

const vfullName = value => {
    if (value.length < 3 || value.length > 35) {
        return (
                <div className="alert alert-danger" role="alert">
                    The fullName must be between 3 and 35 characters.
                </div>
                );
    }
};

const vpassword = value => {
    if (value.length < 4 || value.length > 40) {
        return (
                <div className="alert alert-danger" role="alert">
                    The password must be between 4 and 40 characters.
                </div>
                );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            displayName: "",
            username: "",
            fullName: "",
            email: "",
            mobile: "",
            password: "",
            successful: false,
            noValid: false,
            message: ""
        };
    }

    myChangeHandlerOfCurrObj = (e) => {
        var nam = e.target.name;
        var val = e.target.value;

        this.setState(function (prevState) {
            return {
                ...prevState,
                ...{[nam]: val}
            };
        });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                    this.state.displayName,
                    this.state.username,
                    this.state.fullName,
                    this.state.mobile,
                    this.state.email,
                    this.state.password
                    ).then(
                    response => {
                        this.setState({
                            message: response.data.message,
                            successful: true
                        });
                    },
                    error => {
                        const resMessage =
                                (error.response &&
                                        error.response.data &&
                                        error.response.data.message) ||
                                error.message ||
                                error.toString();

                        this.setState({
                            successful: false,
                            message: resMessage
                        });
                    }
            );
        }
    }

    render() {
        return (
                <Layout>
                    <div className="col-md-12">
                        <div className="card card-containerx">
                            <img
                                src="/signup.png"
                                alt="profile-img"
                                className="profile-img-card"
                                />
                
                            <h5 className="card-title">Registration</h5>
                
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                                this.form = c;
                                            }}
                                >
                                {!this.state.successful && (
                                    <div>
                    
                    
                                        <div className="row">
                    
                                            <div class="col-sm-4">
                                                <div className="form-group">
                                                    <label htmlFor="displayName">Display Name</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="displayName"
                                                        value={this.state.displayName}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, vdisplayName]}
                                                        />
                                                </div>
                                            </div>
                    
                                            <div class="col-sm-4">
                                                <div className="form-group">
                                                    <label htmlFor="username">Username</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="username"
                                                        value={this.state.username}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, vusername]}
                                                        />
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                    
                                                <div className="form-group">
                                                    <label htmlFor="fullName">Full Name</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="fullName"
                                                        value={this.state.fullName}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, vfullName]}
                                                        />
                                                </div>
                                            </div>
                    
                                        </div>
                    
                                        <div className="row">
                    
                                            <div class="col-sm-4">
                    
                                                <div className="form-group">
                                                    <label htmlFor="mobile">Mobile</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="mobile"
                                                        value={this.state.mobile}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, vmobile]}
                                                        />
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                    
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="email"
                                                        value={this.state.email}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, email]}
                                                        />
                    
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                    
                                                <div className="form-group">
                                                    <label htmlFor="password">Password</label>
                                                    <Input
                                                        type="password"
                                                        className="form-control"
                                                        name="password"
                                                        value={this.state.password}
                                                        onChange={this.myChangeHandlerOfCurrObj}
                                                        validations={[required, vpassword]}
                                                        />
                                                </div>
                                            </div>
                                        </div>
                    
                                        <div className="form-group">
                                            <button 
                                                disabled={
                                                                    this.state.noValid ||
                                                                            !this.state.displayName ||
                                                                            !this.state.fullName ||
                                                                            !this.state.username ||
                                                                            !this.state.mobile ||
                                                                            !this.state.email ||
                                                                            !this.state.password
                                                }                        
                                                className="btn btn-primary">Registration</button>
                                        </div>
                                    </div>
                                            )}
                
                                {this.state.message && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                                this.state.successful
                                                                        ? "alert alert-success"
                                                                        : "alert alert-danger"
                                            }
                                            role="alert"
                                            >
                                            {this.state.message}
                                        </div>
                                    </div>
                                            )}
                                <CheckButton
                                    style={{display: "none"}}
                                    ref={c => {
                                            this.checkBtn = c;
                                        }}
                                    />
                            </Form>
                        </div>
                    </div>
                </Layout>
                );
    }
};
