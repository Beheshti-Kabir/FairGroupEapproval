import React, { Component } from "react";
import Input from "react-validation/build/input";
import Layout from "./Layout.comp";
import AuthService from "../services/Auth.service";
import { Link, Redirect } from "react-router-dom";
import Loading from 'react-fullscreen-loading';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.onClickButton = this.onClickButton.bind(this);

        this.state = {
            redirect: "",
            currPassword: "",
            newPassword: "",
            newPasswordAgain: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {

        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});
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

    onClickButton = () => {

        this.setState({loading: true});

        AuthService.changePassword(
                this.state.currPassword,
                this.state.newPassword
                )
                .then(res => {
                    console.log(res.data);

                    if (res.data.message == 'ok') {
                        AuthService.logout();

                        alert('Password Changed, Please Login');

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
                                src="/change-password.png"
                                alt="profile-img"
                                className="profile-img-card"
                                />
                
                            <h5 className="card-title">Change Password</h5>
                
                            <div className="form-group">
                                <label htmlFor="currPassword">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="currPassword"
                                    name="currPassword"
                                    value={this.state.currPassword}
                                    onChange={this.myChangeHandlerOfCurrObj}
                
                                    />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    value={this.state.newPassword}
                                    onChange={this.myChangeHandlerOfCurrObj}
                
                                    />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="newPasswordAgain">New Password(Again)</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="newPasswordAgain"
                                    value={this.state.newPasswordAgain}
                                    onChange={this.myChangeHandlerOfCurrObj}
                                    />
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={this.state.loading ||
                                                !this.state.currPassword ||
                                                !this.state.newPasswordAgain ||
                                                !this.state.newPassword ||
                                                this.state.currPassword == this.state.newPassword ||
                                                this.state.newPasswordAgain != this.state.newPassword

                                    }
                                    type="button"
                                    onClick={this.onClickButton}
                                    >
                                    {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                    <span>Change Password</span>
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
