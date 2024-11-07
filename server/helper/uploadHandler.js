// import multer from 'multer';
// import Config from 'config';
// import Boom from '@hapi/boom';
// const gc = require('../../config/gcConfig');
// const bucket = gc.bucket(`${Config.get('bucketName')}`);

// const vision = require('@google-cloud/vision');

// const client = new vision.ImageAnnotatorClient({
// 	projectId: Config.get('vision.projectId'),
// 	keyFilename: Config.get('vision.keyFilename')
// });

// const multerMid = multer({
// 	storage: multer.memoryStorage(),
// 	limits: {
// 		fileSize: 100 * 1024 * 1024
// 	}
// });

// const uploadSingleFile = (req, res, next) => {
// 	console.log(
// 		`Mime Type : >>>>>>>>>>>>>>>>>>>>>>>>>${req.headers.contentType}`
// 	);
// 	if (!req.file) return next();
// 	const { originalname, buffer } = req.file;
// 	console.log('originalname is', originalname);
// 	let folderPath = req.params.folder ? req.params.folder : 'misc';
// 	console.log('folder issssssssssssssssss', folderPath);
// 	// let fssainame = '';
// 	// if (folderPath == 'fssai') {
// 	// 	fssainame = originalname;
// 	// }
// 	const blob = bucket.file(
// 		`${folderPath}/${Date.now()}_${originalname.replace(/ /g, '_')}`
// 	);
// 	const blobStream = blob.createWriteStream({
// 		resumable: false
// 	});
// 	blobStream
// 		.on('finish', async () => {
// 			await blob.makePublic();
// 			req.file = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
// 			next();
// 		})
// 		.on('error', err => {
// 			next(err);
// 		})
// 		.end(buffer);
// };

// const uploadMultiFiles = (req, res, next) => {
// 	if (!req.files) return next();
// 	// console.log("files are",req.files)
// 	let files = [];
// 	let count = 1;
// 	let folderPath = req.param.folder ? req.param.folder : 'misc';
// 	// console.log('files', req.files);
// 	req.files.forEach(upload => {
// 		const { originalname, buffer } = upload;
// 		const blob = bucket.file(
// 			`${folderPath}/${Date.now()}_${originalname.replace(/ /g, '_')}`
// 		);
// 		const blobStream = blob.createWriteStream({
// 			resumable: false
// 		});
// 		blobStream
// 			.on('finish', async () => {
// 				await blob.makePublic();
// 				files.push(
// 					`https://storage.googleapis.com/${bucket.name}/${blob.name}`
// 				);
// 				if (count === req.files.length) {
// 					req.files = files;
// 					next();
// 				}
// 				count++;
// 			})
// 			.on('error', err => {
// 				next(err);
// 			})
// 			.end(buffer);
// 		// console.log("uploaded files are",files)
// 	});
// };

// const isFoodImages = async function(req, res, next) {
// 	try {
// 		console.log(req.files);
// 		let [result] = await client.labelDetection(req.files[0].buffer);
// 		const labels = result.labelAnnotations;
// 		let result1 = false;
// 		labels.forEach(label => {
// 			console.log(label.description);
// 			if (label.description === 'Food') {
// 				result1 = true;
// 			}
// 		});
// 		if (result1) {
// 			next();
// 		} else {
// 			next(Boom.badRequest('Kindly upload a food Image'));
// 		}
// 	} catch (err) {
// 		console.log(err, 'Error while detacting if produce is food Image');
// 		next(err);
// 	}
// };

// module.exports = {
// 	multerMid,
// 	uploadSingleFile,
// 	uploadMultiFiles,
// 	isFoodImages
// };
