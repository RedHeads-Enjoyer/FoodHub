const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Укажите путь к директории, куда вы хотите сохранять файлы
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Сохраните файл с его оригинальным именем
    }
});

const upload = multer({ storage: storage });

module.exports = upload;