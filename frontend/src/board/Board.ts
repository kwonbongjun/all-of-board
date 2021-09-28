import * as Axios from '../lib/Axios'

export async function getBoardList() {
    const getData = await Axios.get('board/getList');
    return getData.data;
}
export async function getBoard(data: any) {
    const getData = await Axios.get(`board/getBoard${data.id}`, data);
    return getData.data;
}
export async function getComment(data: any) {
    console.log(`board/getComment${data}`);
    const getData = await Axios.get(`board/getComment${data}`, data);
    return getData.data;
}
export async function deleteBoard(data: any) {
    const getData = await Axios.get(`board/deleteBoard${data}`, data);
    return getData.data;
}
export async function getBoardListGroupByCategory() {
    const getData = await Axios.get('board/getGroupByCategory');
    return getData.data;
}