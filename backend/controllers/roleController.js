const Role = require('../models/Role')

class roleController {
    async create(req, res) {
        try {
            const {value} = req.body
            const candidate = await Role.findOne({value})
            if (candidate) {
                return res.status(400).json({message: "Роль с таким названием уже сущствует"})
            }
            const role = new Role({value})
            await role.save()
            return res.json({message: "Роль успешно добавлена"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления роли'})
        }
    }

    async getAll(req, res) {
        try {
            const roles = await Role.find()
            res.json(roles)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении ролей" });
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        try {
            const role = await Role.findById(id)
            if (!role) {
                return res.status(404).json({ message: "Роль не найдена" });
            }
            return res.json(role);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении роли" });
        }
    }


    async deleteById(req, res) {
        const { id } = req.params;
        try {
            const role = await Role.findById(id);
            if (!role) {
                return res.status(404).json({ message: "Роль не найдена" });
            }
            await Role.findByIdAndDelete(id);
            return res.status(200).json({ message: "Роль успешно удалена" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении роли" });
        }
    }

    async updateById(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const role = await Role.findById(id)
            if (!role) {
                return res.status(404).json({ message: "Роль не найдена" });
            }
            Object.assign(role, updatedFields)
            await role.save()
            return res.json({ message: "Роль успешно обновлена", role });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении роли" });
        }
    }
}

module.exports = new roleController()