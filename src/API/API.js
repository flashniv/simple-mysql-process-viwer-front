import axios from "axios";

export default class API {
    static URL = 'https://api-simple-mysql-viewer.clbteam.com/api/v1/'

    //static URL = 'http://localhost:8080'

    static getUser() {
        return localStorage.getItem('userLogin')
    }

    static getPassword() {
        return localStorage.getItem('userPassword')
    }

    static isLoggedIn() {
        const loggedIn = localStorage.getItem('userLogin')
        return loggedIn != null;

    }

    static setLoggedOut() {
        localStorage.setItem('userLogin', null)
        localStorage.setItem('userPassword', null)
    }

    static setLoggedIn(user, password) {
        localStorage.setItem('userLogin', user)
        localStorage.setItem('userPassword', password)
    }

    static async getContent(path) {
        console.log(this.URL + path)
        return await axios.get(this.URL + path, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            }
        });
    }

    static async postContent(path, data) {
        console.log("post " + this.URL + path)
        return await axios.post(this.URL + path, data, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            }
        });
    }

    static async getImg(path) {
        console.log(this.URL + path)
        return await axios.get(this.URL + path, {
            auth: {
                username: this.getUser(),
                password: this.getPassword()
            },
            responseType: 'arraybuffer'
        });
    }

    //---------------------------------------------------------------------------------------------------
    static loginUser(user, password, onSuccess, onFailure) {
        this.setLoggedIn(user, password)
        const response = API.getContent("processesRest/");
        response.then((value) => {
            onSuccess(value.data)
        }, (reason) => {
            this.setLoggedOut()
            onFailure(reason)
        })
    }

    static getProcesses(onSuccess, onFailure) {
        const response = API.getContent("processesRest/");
        response.then((value) => {
            onSuccess(value.data)
        }, (reason) => {
            onFailure(reason)
        })
    }
}
