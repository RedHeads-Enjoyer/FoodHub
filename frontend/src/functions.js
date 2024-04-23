import Cookies from 'js-cookie';

export function getJwtAuthHeader() {
    return {
        headers: {
            Authorization: "Bearer " + Cookies.get("token")
        }
    };
}

export default getJwtAuthHeader