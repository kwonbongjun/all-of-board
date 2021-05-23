import axios from "axios";
let userId;
let userRole;

export let isUser = false;
export function setUser(id, role) {
    userId = id;
    userRole = role;
}
export function getUserId() {
    return userId;
}
export function getUserRole() {
    return userRole;
}
export async function isLoggedIn() {
    try {
        const res = await axios({
            method: 'get',
            url: 'http://localhost:8080/isLoggedIn',
            headers: {
                'content-type': 'application/json;charset=utf-8'
              },
            withCredentials: true
        })
        console.log(res);
        if (res.status === 200) {
           setUser(res.data.id,res.data.role);
        }
    } catch(e) {
        console.log(e);
        window.location.href="/login.html";
    }
   
}
// export default isUser;