const Recipe = require('../models/Recipe')

class recipeController {
    async create(req, res) {
        try {
            const {name, ingredients} = req.body
            const recipe = new Recipe({name, ingredients})
            await recipe.save()
            return res.json({message: "Рецепт успешно добавлен"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Ошибка во время добавления рецепта'})
        }
    }

    async getRecipes(req, res) {
        try {
            const recipes = await Recipe.find()
            res.json(recipes)
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении рецептов" });
        }
    }

    async getRecipe(req, res) {
        const {id} = req.params
        try {
            const recipes = await Recipe.findById(id)
            if (!recipes) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }
            return res.json(recipes);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении рецепта" });
        }
    }


    async deleteRecipe(req, res) {
        const { id } = req.params;
        try {
            const recipes = await Recipe.findById(id);
            if (!recipes) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }
            await Recipe.findByIdAndDelete(id);
            return res.status(200).json({ message: "Рецепт успешно удален" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Ошибка при удалении рецепта" });
        }
    }

    async updateRecipe(req, res) {
        const {id} = req.params
        const updatedFields = req.body
        try {
            const recipes = await Recipe.findById(id)
            if (!recipes) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }
            Object.assign(recipes, updatedFields)
            await recipes.save()
            return res.json({ message: "Рецепт успешно обновлен", recipes });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении рецепта" });
        }
    }
}

module.exports = new recipeController()