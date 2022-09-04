import React, { Component } from "react";
import Layout from "./Layout.comp";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "Approval System"
        };
    }

    componentDidMount() {

    }

    render() {
        return (
                <Layout>
                
                    <div className="container">
                        <header className="jumbotron">
                            <h3>{this.state.content}</h3>
                            <p>A powerful organized approval system, control with detouch.</p> 
                        </header>
                    </div>
                </Layout>

                );
    }
}
