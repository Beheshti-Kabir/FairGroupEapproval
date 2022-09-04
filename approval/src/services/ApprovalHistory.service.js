import axios from "axios";

//const API_URL = "http://192.168.31.66:4001";
const API_URL = "http://10.100.10.27:4001/approval_api/";
//const API_URL = "http://localhost:4001/";

const http = axios.create({
    baseURL: API_URL + "api/approvalHistory",
    headers: {
        "Content-type": "application/json"
    }
});

class ApprovalHistoryService {

    getAll(params) {
        return http.get("/list", {params});
    }


}

export default new ApprovalHistoryService();
