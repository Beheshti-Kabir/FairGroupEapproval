import React, { Component } from "react";
import ApprovalService from "../services/Approval.service";
import AuthUserService from "../services/AuthUser.service";
import AuthService from "../services/Auth.service";
import { Link, Redirect } from "react-router-dom";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.onClickLoadData = this.onClickLoadData.bind(this);

        this.state = {
            redirect: null,
            uid: AuthService.getUid(),
            loading: false,
            selectedFile: null,
            lookup_details_mm: [],
            lookup_details_dd: [],
            sums: [],
            datas: [],
        };
    }

    componentDidMount() {

        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        this.loadQueueSumList();
    }

    loadQueueSumList = () => {

        this.setState({
            loading: true,
        });
        ApprovalService.getQueueSumList({uid: this.state.uid})
                .then((res) => {
                    var mmm = res.data;

                    console.log(res.data);

                    this.setState({
                        loading: false,
                        sums: mmm
                    });
                })
                .catch((e) => {
                    console.log(e);
                    this.setState({
                        loading: false
                    });
                });
    }

    onClickLoadData = (docType) => {
        this.loadQueueList(docType);
    }

    loadQueueList = (docType) => {

        this.setState({
            loading: true,
        });
        ApprovalService.getQueueList({uid: this.state.uid, docType: docType})
                .then((res) => {
                    var mmm = res.data;

                    console.log(res.data);

                    this.setState({
                        loading: false,
                        datas: mmm
                    });
                })
                .catch((e) => {
                    console.log(e);
                    this.setState({
                        loading: false
                    });
                });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const {sums, datas} = this.state;
//<!--<Loading loading=this.state.loading background="#2ecc71" loaderColor="#3498db" />-->

        return (
                <Layout>
                    <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db" />
                
                    <h3>Dashboard</h3>
                
                    <div className="xcontainer">
                        <div>
                        {sums.length!=0 ?
                
                            <div class="row"> 
                                <div class="col-sm-6"> 
                                    <h5>Approval Queue Summary</h5>
                                    <div >
                                        {sums && sums.map((obj, index) => (
                                                <button name={obj.docType}
                                                        className="btn btn-primary"
                                                        style={{margin: "3px"}}
                                                        onClick = {(e) => this.onClickLoadData(e.target.name)}
                                                        >
                                                    {obj.docType} ({obj.cnt})
                                                </button>
                                                                ))}
                
                                    </div>
                                </div>
                            </div>:null}
                
                {datas.length!=0 ?
                            <div className="row">
                
                                <div class="col-sm-12">
                
                                    <h5>Approval Queue</h5>
                
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                
                                                <th scope="col">SLNo</th>
                                                <th scope="col">Document Type</th>
                                                <th scope="col">Document Detail</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datas && datas.map((obj, index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{obj.docType}</td>
                                            <td>{obj.description}</td>
            
                                            <td>
                                                <a className="btn btn-info" target = '_blank' 
                                                   href={obj.url}>
                                                    Open
                                                </a>
                                            </td>
                                        </tr>
                                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>:null}
                        </div>
                    </div>
                </Layout>
                );
    }
}