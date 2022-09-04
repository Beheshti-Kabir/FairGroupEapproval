import axios from "axios";

//const API_URL = "http://192.168.31.66:4001";
const API_URL = "http://10.100.10.27:4001/approval_api/";
//const API_URL = "http://localhost:4001/";

const http = axios.create({
    baseURL: API_URL + "api/approval",
    headers: {
        "Content-type": "application/json"
    }
});

class ApprovalService {

    approvalStatusList(params) {
        return http.get("/approvalStatusList", {params});
    }

    isShowApprovalPanel(data) {
        return http.post("/isShowApprovalPanel",data);
    }
    
    getQueueSumList(data) {
        return http.post("/queueSum",data);
    }

    getQueueList(data) {
        return http.post("/queue",data);
    }
    
    getHistoryList(id) {
        return http.get(`/${id}`);
    }

    submit(data) {
        return http.post("", data);
    }
}

export default new ApprovalService();
