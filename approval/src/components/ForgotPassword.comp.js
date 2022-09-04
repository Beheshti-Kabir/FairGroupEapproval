import React, { Component } from "react";
import Layout from "./Layout.comp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/Auth.service";
import { Link, Redirect } from "react-router-dom";
import Loading from 'react-fullscreen-loading';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.setTrnscDate = this.setTrnscDate.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);

        this.state = {
            code: "",
            dob: new Date(new Date().toISOString()),
            redirect: "",
            loading: false,
            message: ""
        };
    }

    onChangeCode(e) {
        this.setState({
            code: e.target.value
        });
    }

    setTrnscDate(e) {
        this.setState({
            dob: new Date(e.value)
        });
    }

    onClickSubmit(e) {

        this.setState({loading: true});

        AuthService.forgotPassword(this.state.code, this.state.dob)
                .then(res => {
                    console.log(res.data);

                    if (res.data.message == 'ok') {

                        alert('Check Email/Mobile for Response, Please Login');

                        this.setState({
                            loading: false,
                            redirect: '/login',
                        });
                    } else {
                        this.setState({
                            loading: false,
                            message: "Password cannot changed"
                        });
                    }
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

        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <div className="col-md-12">
                        <div className="card card-container">
                            <img
                                src="/forgot-password.png"
                                alt="profile-img"
                                className="profile-img-card"
                                />
                
                            <h5 className="card-title">Forgot Password</h5>
                
                
                            <div className="form-group">
                                <label htmlFor="code">Email/Mobile</label>
                                <input
                                    type="text"
                                    required 
                                    autofocus="true"
                                    className="form-control"
                                    name="code"
                                    value={this.state.code}
                                    onChange={this.onChangeCode}
                
                                    />
                            </div>
                
                            <div class="col-sm-4x">
                
                                <div className="form-group">
                                    <label htmlFor="dob">DoB</label>
                                    <div className="form-group">
                
                                        <DatePicker className="form-control"
                                                    required 
                                                    selected={new Date(this.state.dob ? this.state.dob : new Date().toISOString())} 
                                                    dateFormat="yyyy-MM-dd"
                                                    onChange={(d) => this.setTrnscDate(d)} />
                
                                    </div>
                                </div>
                            </div>
                
                
                            <div className="form-group">
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={this.state.loading ||
                                                !this.state.code
                                    }
                                    onClick={this.onClickSubmit}
                
                                    >
                                    {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                    <span>Submit</span>
                                </button>
                            </div>
                
                            {this.state.message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>
                                    </div>
                                        )}
                
                        </div>
                    </div>
                </Layout>
                );
    }
}
