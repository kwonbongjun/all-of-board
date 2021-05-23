import axios from "axios";
import * as Axios from '../lib/Axios'
type userIdType = string  | undefined;
type userRoleType = string  | undefined;
let userId: string | undefined;
let userRole: string | undefined;

// export let isUser: boolean = false;
export function setUser(id: string, role: string) {
    userId = id;
    userRole = role;
}
export function getUserId() :userIdType {
    return userId;
}
export function getUserRole(): userRoleType {
    return userRole;
}
export function initUserInfo() {
    userId = undefined;
    userRole = undefined;
}
export async function isLoggedIn() {
    try {
        const res = await Axios.get('isLoggedIn');
        if (res.status === 200) {
           setUser(res.data.id,res.data.role);
        }
    } catch(e) {
        console.log(e);
    }
}