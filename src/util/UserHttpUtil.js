import axios from "axios";

const API_URL = "https://fabricaonline.herokuapp.com/users";

export default {
	async listAll() {
		return await axios.get(API_URL).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
	async add(user) {
		return await axios.post(API_URL, user).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
	async edit(user) {
		return await axios.put(API_URL, user).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
};
