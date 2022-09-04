import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Layout from "./Layout.comp";

import AuthService from "../services/Auth.service";

export default class SearchForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: null,

            loading: true,
            checked: [],
            iids: [],
            photos: [],
            navigationItems: [],
            historys: [],
            searchText: '',
            noOfFound: 0,
            pageNo: 1,
            pageSize: 10,
            pageNoMax: 1
        };
    }

    componentDidMount() {
        //if (AuthService.isAuth())
        if (!AuthService.isAuth())
            this.setState({redirect: "/index"});

        this.setState({redirect: "/dashboard"});

        this.setState({uid: AuthService.getUid(), accessToken: AuthService.getAccessToken()})
    }

    handleSubmit = e => {
        e.preventDefault();
        const val = this.search.value;
        //document.getElementById('pageNo');//.value=1;
        // this.(10); 
        this.state.pageSize = 10;
//ReactDOM.findDOMNode(this.refs.pageSize).value=10;
        this.performSearch(val, 1, 10);
    }

    fire = e => {
        const val = this.hist.value;
        this.search.value = val;
        this.performSearch(val, 1, 10);
    }

    pageNoHit = (e, psize) => {
        const valPageNo = e.target.value;
        const val = this.search.value;
        this.performSearch(val, valPageNo, psize);
    }

    pageSizer = (e, pno) => {
        const pageSize = e.target.value;
        const val = this.search.value;
        this.performSearch(val, pno, pageSize);
    }

    /*
     getInitialState=  () =>{
     return {
     checked: [false, false, false]
     };
     }
     */

    selectAll = (event) => {
        // Set all checked states to true
        // alert('aaaaaaaaaaaaaaaaaaaaa'+event.target.checked);

        //var dddd=res.data.photos.map(x=>{return {id:x.id,'ic':false} });

        this.setState({
            checked: this.state.checked.map(x => {
                return {id: x.id, ic: event.target.checked}
            })
        });
    }

    handleCheckBoxChange = (index, event) => {

        var val = event.target.value;
        var isChk = event.target.checked;

        var checked = this.state.checked;

        checked[index] = {id: checked[index].id, ic: isChk};

        this.setState({
            checked: checked
        })
    }

    createAlbum = (tga, albumAccess) => {
        // const tga = this.tagAddRem.value;

        if (sessionStorage.getItem('user') === null)
            return;

        const token = JSON.parse(sessionStorage.getItem('user')).accessToken;

        var body = {
            uid: JSON.parse(sessionStorage.getItem('user')).uid,
            tags: tga,
            albumAccess: albumAccess,
            mode: 'ALBUM',
            iids: this.state.checked.map(x => x.ic ? x.id : '').filter(x => x !== '')
        };

        axios.post('http://localhost:4000/addRemTags',
                body, {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    alert(res.data.message);
                })
                .catch(err => console.log(err));
    }

    addRemTag = (mode, tga) => {
        // const tga = this.tagAddRem.value;

        if (sessionStorage.getItem('user') === null)
            return;

        const token = JSON.parse(sessionStorage.getItem('user')).accessToken;

        var body = {
            uid: JSON.parse(sessionStorage.getItem('user')).uid,
            tags: tga,
            mode: mode,
            iids: this.state.checked.map(x => x.ic ? x.id : '').filter(x => x !== '')
        };

        axios.post('http://localhost:4000/addRemTags',
                body, {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    alert(res.data.message);
                })
                .catch(err => console.log(err));
    }

    performSearch = (searchText, pageNo, pageSize) => {

        if (pageNo === '')
            return;

        const token = this.state.accessToken;

        var body = {
            pageNo: pageNo,
            pageSize: pageSize,
            searchText: searchText,
            uid: this.state.uid
        };

        axios.post('http://localhost:4000/search',
                body, {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                })
                .then((res) => {

                    var dddd = res.data.photos.map(x => {
                        return {id: x.id, 'ic': false}
                    });

                    // alert(JSON.stringify(dddd));

                    this.setState({
                        loading: false,
                        searchText: res.data.searchText,
                        photos: res.data.photos,
                        checked: dddd,
                        noOfFound: res.data.noOfFound,
                        navigationItems: res.data.navigationItems,
                        historys: res.data.historys,
                        pageNo: res.data.pageNo,
                        pageSize: res.data.pageSize,
                        pageNoMax: res.data.pageNoMax
                    })
                }, (err) => {
                    alert(err);
                    console.error(err);
                });
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const {currentUser, historys, navigationItems} = this.state;

        return (
                <Layout>
                
                
                </Layout>

                );
    }
}

