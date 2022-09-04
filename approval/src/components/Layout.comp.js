import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import AuthService from "../services/Auth.service";
import Dropdown from 'react-bootstrap/Dropdown';
        var logout = () => {
confirmAlert({
title: 'Confirm to Logout',
        message: 'Are you sure to do this.',
        buttons: [
        {
        label: 'Yes',
                onClick: async() => {
        await AuthService.logout();
                window.location.reload();
        }
        },
        {
        label: 'No',
                //   onClick: () => alert('Click No')
        }
        ]
});
};
        const NavMenu = () => {

if (!AuthService.isAuth()){
return (
        <div>
    <a href="/login" className="btn btn-primary" >Login</a>
    <a href="/forgotPassword" className="btn btn-danger" >Forgot Password?</a>
//    <a href="/register" className="btn btn-info" >Registration</a>
</div>
        )
}

if (AuthService.getUserType()=='USER'){

return (
 <div class="nav navbar-nav navbar-right">
    <Dropdown>
     <a href="/dashboard" className="btn btn-primary"><b>Dashboard</b></a>
     <a href="/trnscMaster" className="btn btn-success"><b>Transaction</b></a>
     <a href="/dashboard" className="btn btn-warning"> <b>{AuthService.getDisplayName()}</b> </a>
    <button onClick={logout} className="btn btn-danger" ><b>Logout</b></button>
    </Dropdown>
</div>
    )
}

else if (AuthService.getUserType()=='APPROVER'){

return (
<div class="nav navbar-nav navbar-right">
    <Dropdown>
     <a href="/dashboard" className="btn btn-primary"><b>Dashboard</b></a>
     <a href="/approvalHistory" className="btn btn-success">Approval History</a>
     <a href="/dashboard" className="btn btn-warning"> <b>{AuthService.getDisplayName()}</b> </a>
    <button onClick={logout} className="btn btn-danger" ><b>Logout</b></button>
    </Dropdown>
</div>
     )
}

else if (AuthService.getUserType()=='ADMIN'){

return (
        <div class="nav navbar-nav navbar-right">

    <Dropdown>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
            Admin
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item href="/authUser">User Info</Dropdown.Item>
            <Dropdown.Item href="/companyInfo">Company Info</Dropdown.Item>

        </Dropdown.Menu>
    </Dropdown>
    <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            Common
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/home">Home</Dropdown.Item>
            <Dropdown.Item href="/changePassword">Change Password</Dropdown.Item>
            <Dropdown.Item href="/profile">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Action
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item href="/lookupMaster">Lookup</Dropdown.Item>
            <Dropdown.Item href="/aprvUserGroup">Approval User Group</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/trnscUserGroup">Transaction User Group</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/approvalHistory">Approval History</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/ameCondi">Condition Setup</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/ameGroup">Group Setup</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/ame">Approval Setup</Dropdown.Item>

            <Dropdown.Divider />
            {/*<Dropdown.Item href="/trnscMaster">Transaction</Dropdown.Item>*/}

        </Dropdown.Menu>
        <a href="/trnscMaster" className="btn btn-success">Transaction</a>
    </Dropdown>


    <div>
     <a href="/dashboard" className="btn btn-warning"> <b>{AuthService.getDisplayName()}</b> </a>
    </div>
    <button onClick={logout} className="btn btn-danger" >Logout</button>
</div>
        )

}
else {

     return (
             <div class="nav navbar-nav navbar-right">


         <div>
             <a href="/dashboard">
                 <b>{AuthService.getDisplayName()}</b>
             </a>
         </div>
         <button onClick={logout} className="btn btn-danger" >Logout</button>
     </div>
             )

     }

}

const Layout = ({children}) => {

return(
        <>
<div>
    <nav class="navbar navbar-expand-sm" style={{"background-color": "#d3e2ed"}}>
        <div class="container-fluid">
            <div>
                <a href="/"><img src="/logo.png" alt="Logox"/></a>
                <a href="/index" ><b>E-Approval System</b></a>
            </div>
            <NavMenu />
        </div>
    </nav>
</div>

<main>{children}</main>

<nav class="navbar navbar-expand-sm justify-content-center" style={{"background-color": "#d3e2ed", position: "fixedn"}}>
    <div class="container-fluid">
        <i>© 2020 Copyrights</i><a href="https://www.fdl.e-approval.com/"><i><b>www.fdl.e-Approval.com</b></i></a>
    </div>
</nav>
</>
);
}

export default Layout;
