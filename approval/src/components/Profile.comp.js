import React, { Component } from "react"
import Layout from "./Layout.comp"
import AuthService from "../services/Auth.service";
import { Link, Redirect } from "react-router-dom";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currObj: {full_name: "", accessToken: ""}
        };
    }

    componentDidMount() {

        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        const currObj = {full_name: "Mo Maink"};//JSON.parse(sessionStorage.getItem('user'));

        this.setState({currObj: currObj, userReady: true})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const {currObj} = this.state;

        return (
                <Layout>
                
                    <img
                        src="/user-profile.png"
                        alt="profile-img"
                        className="profile-img-card"
                        />
                
                    <h5 className="card-title">{currObj.full_name}</h5>
                
                
                    <div className="container">
                
                    </div>
                </Layout>

                );
    }
}