const path = require('path')

class imageController {
    async getOneByName(req, res) {
        try {
            const { name } = req.params;
            const filePath = path.join(__dirname, '../uploads', name);
            res.sendFile(filePath);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении файла" });
        }
    }
}

module.exports = new imageController()