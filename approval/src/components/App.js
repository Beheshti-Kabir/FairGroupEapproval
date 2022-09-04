import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// App imports
import AuthService from "../services/Auth.service";

import TutorialsList from "./TutorialList.comp";
import Tutorial from "./Tutorial.comp";
import TutorialForm from "./TutorialForm.comp";

import ChangePassword from "./ChangePassword.comp";
import ForgotPassword from "./ForgotPassword.comp";
import AprvUserGroup from "./AprvUserGroup.comp";
import TrnscUserGroup from "./TrnscUserGroup.comp";
import LookupMaster from "./LookupMaster.comp";
import TrnscMaster from "./TrnscMaster.comp";
import ApprovalHistory from "./ApprovalHistoryDisplay.comp";
import TrnscMasterForm from "./TrnscMasterForm.comp";
import TrnscMasterView from "./TrnscMasterView.comp";
import CompanyInfo from "./CompanyInfo.comp";
import AuthUser from "./AuthUser.comp";
import AmeCondi from "./AmeCondi.comp";
import AmeGroup from "./AmeGroup.comp";
import Ame from "./Ame.comp";

import Home from "./Home.comp";
import Login from "./Login.comp";
import Logme from "./App.login.comp";
import Register from "./Signup.comp";
import Index from "./Index.comp";
import Profile from "./Profile.comp";
import Dashboard from "./Dashboard.comp";

class App extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        AuthService.logout();
    }

    render() {

        return (
                <BrowserRouter>
                    <div className="container">
                
                        <Switch>

                        <Route exact path={["/", "/index"]} component={Logme}/>
                        <Route exact path="/logme" component={Logme}/>

//                        <Route exact path={["/", "/index"]} component={Index} />
//                        <Route exact path="/login" component={Login} />
//                        <Route exact path="/register" component={Register} />
//
                        <Route exact path="/dashboard" component={Dashboard} />
                
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/home"  component={Home} />
                
                        <Route exact path="/changePassword" component={ChangePassword} />
                        <Route exact path="/forgotPassword" component={ForgotPassword} />
                        <Route exact path="/authUser" component={AuthUser} />
                        <Route exact path="/companyInfo" component={CompanyInfo} />
                        <Route exact path="/aprvUserGroup" component={AprvUserGroup} />
                        <Route exact path="/trnscUserGroup" component={TrnscUserGroup} />
                        <Route exact path="/lookupMaster" component={LookupMaster} />
                        <Route exact path="/trnscMaster" component={TrnscMaster} />
                        <Route exact path="/approvalHistory" component={ApprovalHistory} />
                        <Route exact path="/trnscMasterForm/:id" component={TrnscMasterForm} />
                        <Route exact path="/trnscMasterView/:id" component={TrnscMasterView} />
                
                        <Route exact path="/ameCondi" component={AmeCondi} />
                        <Route exact path="/ameGroup" component={AmeGroup} />
                        <Route exact path="/ame" component={Ame} />
                
                        <Route exact path="/tutorials_add" component={TutorialForm} />
                        <Route exact path="/tutorials/:id" component={Tutorial} />
                        <Route exact path="/tutorials_list" component={TutorialsList} />
                
                        </Switch>
                    </div>
                </BrowserRouter>
                );
    }
}

export default App;