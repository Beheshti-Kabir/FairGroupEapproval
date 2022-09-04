import Cookie from 'universal-cookie';
//aa
const cookie = new Cookie();

class CookieService {

    get(key) {
        return cookie.get(key);
    }

    set(key, at, ops) {
        cookie.set(key, at, ops);
    }

    remove(key) {
        cookie.remove(key);
    }
}

export default new CookieService();
