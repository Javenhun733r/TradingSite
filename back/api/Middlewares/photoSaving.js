// const multer = require('multer');
// const path = require('path');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads')); // Директорія для збереження файлів
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix =  Math.round(Math.random() * 1e10);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });
//
// const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
//
// module.exports = upload;