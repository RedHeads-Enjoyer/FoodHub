const path = require('path')
const fs = require('fs');

class imageController {
    async getOneByName(req, res) {
        const { name } = req.params;
        try {
            const filePath = path.join(__dirname, '../uploads', name);
            console.log(filePath)
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // Если файл не найден, отправляем запасное изображение
                    const placeholderPath = path.join(__dirname, '../uploads', "image_placeholder.svg");
                    console.log(placeholderPath)
                    res.sendFile(placeholderPath);
                    return;
                }
                console.log(filePath)
                // Если файл найден, отправляем его
                res.sendFile(filePath);
            });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении файла" ,da : path.join(__dirname, '../uploads', name)});
        }
    }
}

module.exports = new imageController()