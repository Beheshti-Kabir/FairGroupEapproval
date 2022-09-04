import React, {Component} from "react";
import LookupDetailService from "../services/LookupDetail.service";
import TrnscMasterService from "../services/TrnscMaster.service";
import CompanyInfoService from "../services/CompanyInfo.service";
import FILES_BASE_URL from "../services/Files.service";
import AuthService from "../services/Auth.service";
import {Link, Redirect} from "react-router-dom";
import Layout from "./Layout.comp";
import Loading from 'react-fullscreen-loading';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from "react-dropdown-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
//const API_URL = "http://192.168.31.66:4001";
const API_URL = "http://10.100.10.27:4001/approval_api/";
//const API_URL = "http://localhost:4001/";
const getClearDetObj = () => {
    return {
        lookupDetailParticular: null,
        quantitive: false,
        lineTotal: '',
        description: '',
        qty: '',
        unitPrice: '',
        remarks: ''
    };
};
export default class TrnscMasterFrom extends Component {
    constructor(props) {
        super(props);
        this.clear = this.clear.bind(this);
        this.setTrnscDate = this.setTrnscDate.bind(this);
        this.onClickAddAmendDet = this.onClickAddAmendDet.bind(this);
        this.retrieveTrnscDetailMmObjs = this.retrieveTrnscDetailMmObjs.bind(this);
        this.retrieveCompanyInfoObjs = this.retrieveCompanyInfoObjs.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.retrieveTrnscDetailDdObjs = this.retrieveTrnscDetailDdObjs.bind(this);
        this.retrieveFundSourceObjs = this.retrieveFundSourceObjs.bind(this);
        this.retrieveAdmendRefObjs = this.retrieveAdmendRefObjs.bind(this);
        this.onChangeCompanyId = this.onChangeCompanyId.bind(this);
        this.onClickClearDet = this.onClickClearDet.bind(this);
        this.onClickRemoveDet = this.onClickRemoveDet.bind(this);
        this.onClickRemoveDetAttach = this.onClickRemoveDetAttach.bind(this);
        this.onClickLoadDet = this.onClickLoadDet.bind(this);
        this.onClickSaveUpdate = this.onClickSaveUpdate.bind(this);
        this.state = {
            redirect: null,
            loading: false,
            selectedFile: null,
            customFileName: '',
            companyInfos: [],
            lookup_details_mm: [],
            lookup_details_fund_source: [],
            trnsc_master_admend_ref:[],
            lookup_details_dd: [],
            currObj: {},
            currDetObj: {},
        };
    }

    myChangeHandlerCustomFileName = (e) => {
        var val = e.target.value;
        this.setState({customFileName: val});
        //alert(JSON.stringify(abc));
    }

    myChangeHandlerOfCurrObj = (e) => {
        var nam = e.target.name;
        var val = e.target.value;
        //this.setState({[nam]: val});
        //alert(JSON.stringify(abc));

        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    ...{[nam]: val}
                }
            };
        });
    }

    myChangeHandlerOfCurrDetObj = (e) => {
        var nam = e.target.name;
        var val = e.target.value;
        //this.setState({[nam]: val});
        //alert(JSON.stringify(abc));

        this.setState(function (prevState) {
            return {
                currDetObj: {
                    ...prevState.currDetObj,
                    ...{[nam]: val}
                }
            };
        });
    }

    componentDidMount() {

        if (!AuthService.isAuth()) {
            //alert("sssssssssssss");
            this.setState({redirect: "/index"});
        }
        this.retrieveCompanyInfoObjs();
        this.retrieveFundSourceObjs();
        this.retrieveAdmendRefObjs();
        //this.retrieveTrnscDetailDdObjs();
        this.retrieveTrnscDetailMmObjs();
        var id = this.props.match.params.id;

        //alert(id);

        if (id !== 'null')
            this.onClickLoadForm(id);
        else
            this.clear();
        //this.retrieveObjs();
    }

    setTrnscDate = (d) => {
        this.setState(function (prevState) {
            return {
                currObj: {
                    ...prevState.currObj,
                    trnscDate: d
                }
            };
        });
    }


    retrieveCompanyInfoObjs = () => {

        this.setState({loading: true});
        CompanyInfoService.getAllActive({_mandatory: true})
            .then((res) => {
              //  alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    companyInfos: res.data,
                });
            })
            .catch((e) => {
                console.log(e);
                //alert(JSON.stringify(e));

                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

    retrieveTrnscDetailMmObjs = () => {

        this.setState({loading: true});
        LookupDetailService.getAllLookupDetailsDocType({_req_auth_user_id: AuthService.getUid()})
            .then((res) => {
               // alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    lookup_details_mm: res.data,
                });
            })
            .catch((e) => {
                console.log(e);
                //alert(JSON.stringify(e));

                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

        retrieveFundSourceObjs = () => {

            this.setState({loading: true});
            LookupDetailService.getAllLookupDetailParentCode({parent_code: "FUND_SOURCE"})
                .then((res) => {
                // alert(JSON.stringify(res.data));
                console.log(res.data);
            this.setState({
                loading: false,
                lookup_details_fund_source: res.data,
            });
        })
        .catch((e) => {
                console.log(e);
            //alert(JSON.stringify(e));

            this.setState({
                loading: false
            });
            // this.state.loading = false;
        });
        }

retrieveAdmendRefObjs = () => {

     this.setState({loading: true});
    TrnscMasterService.getCodeAllTrnsc({_req_auth_user_id: AuthService.getUid()})
        .then((res) => {
         //alert(JSON.stringify(res.data));
        console.log(res.data);
    this.setState({
        loading: false,
        trnsc_master_admend_ref: res.data,
    });
})
.catch((e) => {
        console.log(e);
    //alert(JSON.stringify(e));

    this.setState({
        loading: false
    });
    // this.state.loading = false;
});
}

    retrieveTrnscDetailDdObjs = (pId) => {

        this.setState({loading: true});
        LookupDetailService.getAllLookupDetailsParticular({_mandatory: true, parent_id: pId })
            .then((res) => {
                //alert(JSON.stringify(res.data));
                console.log(res.data);
                this.setState({
                    loading: false,
                    lookup_details_dd: res.data,
                });
            })
            .catch((e) => {
                console.log(e);
                //alert(JSON.stringify(e));

                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

    onClickLoadDet = (e) => {
        var fff = e.target.name;
        var obj = this.state.currObj.trnscDetails[fff];
        // obj['lookupDetailParticular'] ={id: obj.lookupDetailParticular.id, code: obj.lookupDetailParticular.code};

        this.setState({
            currDetObj: obj
        });
    }

    onClickLoadForm = (id) => {
//alert(JSON.stringify(id));

        this.setState({
            loading: true,
            //   message: undefined
        });
        TrnscMasterService.get(id)
            .then((res) => {
                //alert(JSON.stringify(res.data));
                console.log(res.data);
                var mmm = res.data;
                if (mmm.approvalStatus == 'SUBMITTED' || mmm.approvalStatus == 'APPROVED') {

                    this.setState({
                        loading: false,
                        redirect: '/trnscMaster'
                    });
                } else {

                    ///var nwLins = [];
                    //for (var i = 0; i < mmm.trnscDetails.length; i++) {
                    //     var onLine = mmm.trnscDetails[i];
                    //     onLine['_index'] = i;
                    //     nwLins.push(onLine);
                    //}
                    //  mmm['trnscDetails'] = nwLins;
                    // alert(JSON.stringify(mmm));

                    this.setState({
                        loading: false,
                        currObj: mmm

                    });
                }
            })
            .catch((e) => {
                //alert(JSON.stringify(e));

                console.log(e);
                this.setState({
                    loading: false
                });
                // this.state.loading = false;
            });
    }

    onChangeTrnscDetailDependentId = (e) => {

        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                lookupDetailTrnscType: {id: val.value, code: val.label}
            }
        }));

        this.retrieveTrnscDetailDdObjs(val.value);
    }


onChangeTrnscDetailFundSource = (e) => {

    if (!e)
        return;
    const val = e;
    this.setState(prevState => ({
        currObj: {
            ...prevState.currObj,
        lookupDetailFundSource: {id: val.value, code: val.label}
    }
}));

    this.retrieveFundSourceObjs(val.value);
}


onChangeAdmendRef = (e) => {
//alert(e);
    if (!e)
        return;
    const val = e;
    this.setState(prevState => ({
        currObj: {
            ...prevState.currObj,
        trnscMasterAdmendRef: {id: val.value, code: val.label}
    }
}));

    this.retrieveAdmendRefObjs(val.code);
}

onChangeCompanyId = (e) => {

        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
            currObj: {
                ...prevState.currObj,
                companyInfo: {id: val.value, code: val.label}
            }
        }));
    }

    onChangeTrnscDetailDependentIdDet = (e) => {

        if (!e)
            return;
        const val = e;
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                lookupDetailParticular: {id: val.value, code: val.label}
            }
        }));
    }

    onClickSaveUpdate = () => {

//alert(JSON.stringify(this.state.currObj));

//value={ currObj.trnscDetails && currObj.trnscDetails.length!==0 ?   currObj.totalAmount : 0 }

        this.setState({loading: true});
//this.state.currObj

        /*
         if (!this.state.currObj.trnscDetails || this.state.currObj.trnscDetails.length == 0){
         this.setState(prevState => ({
         currObj: {
         //...prevState.currObj,
         totalAmount: 0
         }
         }));
         }*/

        if (this.state.currObj.id === undefined) {
            TrnscMasterService.create(
                this.state.currObj
            )
                .then(res => {

                    //    alert('aaaaaaaaaa' + JSON.stringify(res.data));
                    console.log(res.data);
                    this.setState({

                        loading: false,
                        message: "Added Successfully!",
                        redirect: "/trnscMasterView/" + res.data.id

                    });
                    //    this.clear();
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});
                });
        } else {

            TrnscMasterService.update(
                this.state.currObj.id,
                this.state.currObj
            )
                .then(res => {
                    console.log(res.data);
                    this.setState({
                        loading: false,
                        message: "Updated Successfully!",
                        redirect: "/trnscMasterView/" + this.state.currObj.id
                    });
//qqqqqqqqqqqqqqqqq
                    //this.setState({redirect: "/index"});

                    // this.onClickLoadForm(this.state.currObj.id);
                })
                .catch(e => {
                    console.log(e);
                    this.setState({loading: false});
                });
        }
    }

    deleteObj = () => {
        this.setState({loading: true});
        TrnscMasterService.delete(this.state.currObj.id)
            .then(res => {
                this.setState({
                    loading: false,
                    message: "Deleted Successfully!"
                });
                this.clear();
            })
            .catch(e => {
                console.log(e);
                this.setState({loading: false});
            });
    }

    deleteAlert = () => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteObj() //alert('Click Yes')
                },
                {
                    label: 'No',
                    onClick: () => null //alert('Click No')
                }
            ]
        });
    }

    clear = () => {
        this.setState({
            message: '',
            currObj: {
                code: '', trnscDate: new Date().toISOString(), description: '',
                approvalStatus: 'NOT_SUBMITTED', totalAmount: 0,
                lookup_detail_trnsc_type_id: null, trnscDetails: []
            }
        });
        //alert("sssssssssssss"+JSON.stringify(this.state.currObj));
    }

    onClickClearDet = () => {
        this.setState({
            currDetObj: getClearDetObj()
        });
    }

    onClickRemoveDetAttach = (idx) => {

        var obbb = this.state.currObj['trnscAttachs'][(idx)];
//        var obbb = this.state.currDetObj;
        //alert(JSON.stringify(obbb));

        var xxx;
        if (obbb.id !== undefined) {
            xxx = this.state.currObj;
            var ggg;
            if (obbb._mode === 'DELETED') {
                obbb._mode = undefined;
                ggg = xxx['trnscAttachs'].map(el => el.id === obbb.id ? {...el, ...obbb} : el);
            } else {
                ggg = xxx['trnscAttachs'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'DELETED'} : el);
            }

//   alert(JSON.stringify(xxx));
        } else {

            xxx = this.state.currObj;
            var ggg = xxx['trnscAttachs'];
            var ppp = ggg.splice(obbb._index, 1);
//              alert(JSON.stringify(xxx));
        }
        xxx['trnscAttachs'] = ggg;
        this.setState({currObj: xxx});
    }

    handleChangeIsQuantitive = (e) => {
        this.setState(prevState => ({
            currDetObj: {
                ...prevState.currDetObj,
                quantitive: !this.state.currDetObj['quantitive'],
                lineTotal: null,
                qty: null,
                unitPrice: null
            }
        }));
    }

    onClickRemoveDet = (idx) => {

        var obbb = this.state.currObj['trnscDetails'][(idx)];
//        var obbb = this.state.currDetObj;
        //alert(JSON.stringify(obbb));

        var xxx;
        if (obbb.id !== undefined) {
            xxx = this.state.currObj;
            var ggg;
            if (obbb._mode === 'DELETED') {
                obbb._mode = undefined;
                ggg = xxx['trnscDetails'].map(el => el.id === obbb.id ? {...el, ...obbb} : el);
            } else {
                ggg = xxx['trnscDetails'].map(el => el.id === obbb.id ? {...el, ...obbb, _mode: 'DELETED'} : el);
            }

//   alert(JSON.stringify(xxx));
        } else {

            xxx = this.state.currObj;
            var ggg = xxx['trnscDetails'];
            var ppp = ggg.splice(obbb._index, 1);
//              alert(JSON.stringify(xxx));
        }
        xxx['trnscDetails'] = ggg;
        var totalAmount = ggg.reduce((a, b) => {
            return a + Number(b.lineTotal);
//        return a + (Number(b.lineTotal) + Number(b.qty) * Number(b.unitPrice));
        }, 0);
        //if (xxx['trnscDetails'].length === 0)
        //totalAmount = 0;
        xxx['totalAmount'] = totalAmount;
        this.setState({currObj: xxx, currDetObj: getClearDetObj()});
    }

    onClickAddAmendDet = () => {

        var obbb = this.state.currDetObj;
        if (obbb.lineTotal || (obbb.qty && obbb.unitPrice))
            console.log("ok");
        else {
            alert("Enter Quantity and Unit Price or Amount only");
            return;
        }

//alert(JSON.stringify(obbb));
        var ggg;
        var xxx = this.state.currObj;
        if (obbb.id === undefined) {

            ggg = xxx['trnscDetails'];
            if (ggg === undefined)
                ggg = [];
            if (obbb['_mode'] === undefined) {
                obbb['_mode'] = 'NEW';
                obbb['_index'] = ggg.length;
                if (obbb['quantitive'])
                    obbb['lineTotal'] = obbb.qty * obbb.unitPrice;
                //obbb['lineTotal'] = (obbb.lineTotal ? obbb.lineTotal : 0) + (obbb.qty ? obbb.qty : 0) * (obbb.unitPrice ? obbb.unitPrice : 0);
                ggg.push(obbb);
            } else {
                ggg = xxx['trnscDetails'].map(el => el._index === obbb._index ? {
                    ...el, ...obbb,
                    lineTotal: (obbb.quantitive ? obbb.qty * obbb.unitPrice : obbb.lineTotal),
                    _mode: 'NEW_UPDATED'
                } : el);
//ggg = xxx['trnscDetails'].map(el => el._index === obbb._index ? {...el, ...obbb, lineTotal: (obbb.lineTotal ? obbb.lineTotal :0) + Number((obbb.qty ? obbb.qty : 0) * (obbb.unitPrice ? obbb.unitPrice : 0)), _mode: 'NEW_UPDATED'} : el);
            }

        } else {

            ggg = xxx['trnscDetails'].map(el => el.id === obbb.id ? {
                ...el, ...obbb,
                lineTotal: (obbb.quantitive ? obbb.qty * obbb.unitPrice : obbb.lineTotal),
                _mode: 'UPDATED'
            } : el);
        }
        xxx['trnscDetails'] = ggg;
        //alert(JSON.stringify(xxx));
        var totalAmount = ggg.reduce((a, b) => {
            return a + Number(b.lineTotal);
//            return a + b.qty * b.unitPrice;
        }, 0);
        //if (xxx['trnscDetails'].length === 0)
        //totalAmount = 0;

        xxx['totalAmount'] = totalAmount;
        this.setState({currObj: xxx, currDetObj: getClearDetObj()});
    }

    getLabel = id => {
//  alert(id);
        var kk = this.state.lookup_details_dd.filter(x => x.value === id);
        if (kk === null || kk === undefined || kk[0] === undefined)
            return ''
        else
            return kk[0].label;
    }

// On file select (from the pop up) 
    onFileChange = event => {
// Update the state 
        this.setState({
            selectedFile: event.target.files[0],
            customFileName: event.target.files[0].name
        });
    }

// On file upload (click the upload button) 
    onFileUpload = async () => {

        if (this.state.selectedFile == null) {
            alert("select file");
            return;
        }

        var currId = this.state.currObj.id;
        // Create an object of formData 
        const formData = new FormData();
        // Update the formData object 
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        formData.append('id', currId);
        formData.append('customFileName', this.state.customFileName);
        // Details of the uploaded file 
        console.log(this.state.selectedFile);
        // Request made to the backend api 
        // Send formData object 
        //alert("File uploaded.....");

        await axios.post(API_URL + "api/admin/uploadfile", formData);
        // alert("File uploaded");
        this.setState({selectedFile: null, customFileName: ''});
        this.onClickLoadForm(currId);
    }

// File content to be displayed after 
// file upload is complete 
    fileData = () => {
        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {
            currObj
        } = this.state;
//<!--<Loading loading=this.state.loading background="#2ecc71" loaderColor="#3498db" />-->

        return (
            <Layout>
                <Loading loading={this.state.loading} background="#2ecc71" loaderColor="#3498db"/>

                <h3>Transaction Form</h3>

                <div className="xcontainer">

                    <div>
                        <div className="row">

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="companyInfo">Company</label>

                                    <Select id="companyInfo" options={this.state.companyInfos}
                                            className="form-control"
                                            values={this.state.companyInfos.filter(z => currObj.companyInfo && z.value === currObj.companyInfo.id)}
                                            onChange={v => this.onChangeCompanyId(v[0])}/>
                                </div>
                            </div>

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="lookupDetailDependent">Document Type</label>

                                    <Select id="lookupDetailDependent" options={this.state.lookup_details_mm}
                                            className="form-control"
                                            values={this.state.lookup_details_mm.filter(z => currObj.lookupDetailTrnscType && z.value === currObj.lookupDetailTrnscType.id)}
                                            onChange={v => this.onChangeTrnscDetailDependentId(v[0])}/>
                                </div>
                            </div>

                            <div class="col-sm-3">

                                <div className="form-group">
                                <label htmlFor="lookupDetailFundSource">Fund Source</label>

                                    <Select id="lookupDetailFundSource" options={this.state.lookup_details_fund_source}
                                    className="form-control"
                                    values={this.state.lookup_details_fund_source.filter(z => currObj.lookupDetailFundSource && z.value === currObj.lookupDetailFundSource.id)}
                                    onChange={v => this.onChangeTrnscDetailFundSource(v[0])}/>
                                </div>
                            </div>

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="trnscMasterAdmendRef">Admendment Reference</label>
                                    <Select id="trnscMasterAdmendRef" options={this.state.trnsc_master_admend_ref}
                                    className="form-control"
                                    values={this.state.trnsc_master_admend_ref.filter(z => currObj.trnscMasterAdmendRef && z.value === currObj.trnscMasterAdmendRef.id)}
                                    onChange={v => this.onChangeAdmendRef(v[0])}/>
                                </div>
                            </div>


                        <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="trnscDate">Date</label>
                                    <div className="form-group">

                                        <DatePicker className="form-control"
                                                    selected={new Date(currObj.trnscDate ? currObj.trnscDate : new Date().toISOString())}
                                                    dateFormat="yyyy-MM-dd"
                                                    onChange={(d) => this.setTrnscDate(d)}/>

                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        value={currObj.description}
                                        name="description"
                                        onChange={this.myChangeHandlerOfCurrObj}
                                    />
                                </div>
                            </div>

                            <div class="col-sm-3">
                                <div className="form-group">
                                    <label htmlFor="code">Code/Doc Ref No</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="code"
                                        value={currObj.code}
                                        name="code"
                                        disabled={true}
                                        onChange={this.myChangeHandlerOfCurrObj}
                                    />
                                </div>
                            </div>



                            <div class="col-sm-3">
                                <div className="form-group">
                                    <label htmlFor="name">Total Amount</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        disabled={true}
                                        value={ currObj.totalAmount }
                                        />
                                </div>
                            </div>

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="approvalStatus">Approval Status</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="approvalStatus"
                                        disabled={true}
                                        value={currObj.approvalStatus}

                                    />
                                </div>
                            </div>
                        </div>
                        {currObj.id ? <div className="row">


                            <div class="col-sm-6">
                                <input type="file" onChange={this.onFileChange}/>

                                <div className="form-group">
                                    <label htmlFor="customFileNamex">Custom File Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="customFileNamex"

                                        value={this.state.customFileName}

                                        onChange={this.myChangeHandlerCustomFileName}

                                    />
                                </div>

                                <button
                                    disabled={!this.state.customFileName}
                                    className='btn btn-primary'
                                    type="button"
                                    onClick={this.onFileUpload}
                                >
                                    Add Attachment
                                </button>


                                <table class="table table-sm">
                                    <thead>
                                    <tr>

                                        <th scope="col">SLNo</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Size</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {currObj.trnscAttachs &&
                                    currObj.trnscAttachs.map((obj, index) => (
                                        <tr>

                                            <td>{index + 1}</td>
                                            <td>{obj.name}</td>

                                            <td>{(obj.fileSize / 1024).toFixed(2)} KB</td>
                                            <td>

                                                <a className="btn btn-info" target='_blank'
                                                   href={FILES_BASE_URL + "transAttach/" + obj.code}>
                                                    Download
                                                </a>

                                                <button name={index}
                                                        className={this.state.currObj.trnscAttachs[index]._mode == 'DELETED' ? 'btn btn-primary' : 'btn btn-danger'}
                                                        onClick={(e) => this.onClickRemoveDetAttach(e.target.name)}
                                                >
                                                    {this.state.currObj.trnscAttachs[index]._mode == 'DELETED' ? 'UnDelete' : 'Delete'}

                                                </button>
                                            </td>
                                        </tr>

                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                            : null}
                        <div className="row">

                            <div class="col-sm-6">

                                {currObj.id ?
                                    <button
                                        className="btn btn-danger"
                                        onClick={this.deleteAlert}

                                    >
                                        Delete
                                    </button>
                                    : null}
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={this.onClickSaveUpdate}

                                >
                                    {currObj.id ? 'Update' : 'Save'}
                                </button>

                                <Link
                                    to={ "/trnscMaster" + (currObj.id ? "View/" + currObj.id : "")}
                                    className="btn btn-primary"
                                >
                                    Cancel
                                </Link>

                            </div>
                            <p>{this.state.message}</p>
                        </div>
                        <h5>Transaction Details</h5>

                        <div className="row">


                            {/*<div class="col-sm-3">*/}

                                {/*<div className="form-group">*/}
                                    {/*<label htmlFor="lookupDetailParticular">Particular</label>*/}

                                    {/*<Select id="lookupDetailParticular" options={this.state.lookup_details_dd}*/}
                                            {/*className="form-control"*/}
                                            {/*values={this.state.lookup_details_dd.filter(z => this.state.currDetObj.lookupDetailParticular && z.value === this.state.currDetObj.lookupDetailParticular.id)}*/}
                                            {/*onChange={v => this.onChangeTrnscDetailDependentIdDet(v[0])}/>*/}
                                {/*</div>*/}
                            {/*</div>*/}

                            <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="codeDes">Description</label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codeDes"
                                        value={this.state.currDetObj.description}
                                        name="description"
                                        onChange={this.myChangeHandlerOfCurrDetObj}
                                    />
                                </div>
                            </div>

<div class="col-sm-3">


                                    <div className="form-group">
                                        <label htmlFor="codeDet">Amount</label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            id="codeDet"
                                            value={this.state.currDetObj.lineTotal}
                                            name="lineTotal"
                                            onChange={this.myChangeHandlerOfCurrDetObj}
                                        />
                                    </div>
                                </div>
                     <div class="col-sm-3">

                                <div className="form-group">
                                    <label htmlFor="codeDes">Remarks</label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codeDes"
                                        value={this.state.currDetObj.remarks}
                                        name="remarks"
                                        onChange={this.myChangeHandlerOfCurrDetObj}
                                    />
                                </div>
                            </div>
                    </div>
                        <div className="row">
                            <div class="col-sm-6">


                                <button
                                    className='btn btn-primary'

                                    type="button"
                                    onClick={this.onClickAddAmendDet}
                                >
                                    { 'this.state.currObj.trnscDetails.length == 0 || Object.keys(this.state.currDetObj).length' == 0 ? 'Add' : 'Add'}
                                </button>

                                { Object.keys(this.state.currDetObj).length != 0 ?
                                    <button
                                        className="btn btn-warning"
                                        type="button"
                                        onClick={this.onClickClearDet}
                                    >
                                        New
                                    </button> : null}
                            </div>
                        </div>


                        <div className="row">

                            <div class="col-sm-12">

                                <table class="table table-sm">
                                    <thead>
                                    <tr>

                                        <th scope="col">SLNo</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Remarks</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                    {currObj.trnscDetails &&
                                    currObj.trnscDetails.map((obj, index) => (
                                        <tr>


                                            <td>{index + 1}</td>
                                            <td>{obj.description}</td>
                                            <td>{obj.lineTotal}</td>
                                            <td>{obj.remarks}</td>
                                            <td>
                                                <button name={index}
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={this.onClickLoadDet}
                                                >
                                                    Load
                                                </button>
                                                <button name={index}
                                                        className={this.state.currObj.trnscDetails[index]._mode === 'DELETED' ? 'btn btn-primary' : 'btn btn-danger'}
                                                        onClick={(e) => this.onClickRemoveDet(e.target.name)}
                                                >
                                                    {this.state.currObj.trnscDetails[index]._mode === 'DELETED' ? 'UnDelete' : 'Delete'}

                                                </button>
                                            </td>
                                        </tr>

                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>

                </div>
            </Layout>

        );
    }
}

/*
 <th scope="col">IDX</th>
 <th scope="col">ID</th>
 <th scope="col">User</th>
 <th scope="col">Mode</th>

 <td>{obj._index}</td>
 <td>{obj.id}</td>
 <td>{obj.auth_user_id}</td>
 <td>{obj._mode}</td>
 */
