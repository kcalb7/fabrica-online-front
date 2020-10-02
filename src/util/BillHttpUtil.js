import axios from "axios";

const API_URL = "https://fabricaonline.herokuapp.com/bills";

export default {
	async listAll() {
		return await axios.get(API_URL).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
	async add(bill) {
		return await axios.post(API_URL, bill).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
	async edit(bill) {
		return await axios.put(API_URL, bill).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
	async delete(bill) {
		return await axios.delete(API_URL + "/" + bill._id).then((res, err) => {
			if (err) console.log(err);
			return { status: res.status, data: res.data };
		});
	},
};
