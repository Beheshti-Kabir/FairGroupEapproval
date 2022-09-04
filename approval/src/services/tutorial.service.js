//import http from "../http-common";
import axios from "axios";

//const API_URL = "http://192.168.31.66:4001";
const API_URL = "http://10.100.10.27:4001/approval_api/";
//const API_URL = "http://localhost:4001/";

const http = axios.create({
    baseURL: API_URL + "api/tutorials",
    headers: {
        "Content-type": "application/json"
    }
});

class TutorialDataService {

    getAll(params) {
        return http.get("/", {params});
    }

    get(id) {
        return http.get(`/${id}`);
    }

    create(data) {
        return http.post("", data);
    }

    update(id, data) {
        return http.put(`/${id}`, data);
    }

    delete(id) {
        return http.delete(`/${id}`);
    }
}
;

export default new TutorialDataService();
