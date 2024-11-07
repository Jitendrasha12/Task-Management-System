import Path from 'path';
import bcrypt from "bcryptjs";
import responseMessage from "../../assets/responseMessage.js";
import apiError from '../helper/apiError.js';


/**
 * Fetch root directory path
 */
const getRootDir = () => Path.normalize(`${__dirname}/../..`);
const verifyingCredentials = async (userPassword, inputPassword) => {
	console.log(userPassword,inputPassword,'this is our passwords')
  let isPasswordCorrect =  await bcrypt.compare(
    inputPassword,
    userPassword
  );
	if (!isPasswordCorrect) throw apiError.badRequest(responseMessage.INCORRECT_LOGIN);
};


const generate4DigitOTP = () => {
	var digits = '0123456789';
	let OTP = '';
	for (let i = 1; i < 5; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
};

const encryptPassword = async (password) => {
  const hashedPass = await bcrypt.hash(password, 10);
  return hashedPass;
};

const generateCustomerId = (id, type) => {
	var dt = new Date();

	const timeStamp = `${dt.getDate().toString()}${
		(dt.getMonth() + 1).toString().length == 1
			? '0' + (dt.getMonth() + 1).toString()
			: (dt.getMonth() + 1).toString()
		}${dt
			.getFullYear()
			.toString()
			.substr(
				2
			)}${dt
				.getHours()
				.toString()}${dt.getMinutes().toString()}${dt.getSeconds().toString()}`;

	return `IN${type[0]}${timeStamp}${id.substring(0, 3)}`.toUpperCase();
};

const generateOrderId = () => {
	var dt = new Date();

	const timeStamp = `${dt.getDate().toString()}${
		(dt.getMonth() + 1).toString().length == 1
			? '0' + (dt.getMonth() + 1).toString()
			: (dt.getMonth() + 1).toString()
		}${dt
			.getFullYear()
			.toString()
			.substr(
				2
			)}${dt
				.getHours()
				.toString()}${dt.getMinutes().toString()}${dt.getSeconds().toString()}`;

	return `ODR${timeStamp}`.toUpperCase();
};

const flatObject = obj => {
	const getEntries = (o, prefix = '') =>
		Object.entries(o).flatMap(([k, v]) =>
			Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]
		);
	return Object.fromEntries(getEntries(obj));
};

const makePageObject = (query) => {
	let pageObject = { skip: 0, limit: 10 };
	if (query.pageNo && query.pageSize) {
		const pageNo = parseInt(query.pageNo);
		const pageSize = parseInt(query.pageSize);
		if (isFinite(pageNo) && isFinite(pageSize)) {
			const skip = (pageNo - 1) * pageSize;
			const limit = pageSize;
			pageObject.skip = skip;
			pageObject.limit = limit;
			return pageObject;
		}
	}
	return pageObject;
};
const capitalizeFirstLetter = (string) => {
	let word = string.trim()
	return word.charAt(0).toUpperCase() + word.slice(1);
  }
module.exports = {
  generate4DigitOTP,
  getRootDir,
  flatObject,
  generateCustomerId,
  generateOrderId,
  makePageObject,
  capitalizeFirstLetter,
  encryptPassword,
  verifyingCredentials,
};
