const path = require('path')
const fs = require('fs');

class imageController {
    async getOneByName(req, res) {
        try {
            const { name } = req.params;
            const filePath = path.join(__dirname, '../uploads', name);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) res.sendFile(filePath);
                const filePath = path.join(__dirname, '../uploads', "image_placeholder.svg");
                res.sendFile(filePath);
            });

        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении файла" });
        }
    }
}

module.exports = new imageController()