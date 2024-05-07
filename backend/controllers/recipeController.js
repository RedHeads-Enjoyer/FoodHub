const Recipe = require('../models/Recipe')
const User = require('../models/User')
const path = require('path')

class recipeController {
    async create(req, res) {
        try {
            const {
                name,
                description,
                difficult,
                ingredients,
                kitchenID,
                typeID,
                equipment,
                steps,
                visibility
            } = req.body;

            const image = req.file.filename; // Путь к загруженному файлу изображения
            const recipe = new Recipe({
                name,
                description,
                difficult,
                ingredients: JSON.parse(ingredients),
                kitchenID,
                typeID,
                equipment: JSON.parse(equipment),
                steps: JSON.parse(steps),
                visibility,
                authorID: req.user._id,
                image});



            await recipe.save();

            const user = req.user
            user.recipes.push({id: recipe._id})
            await user.save()
            return res.json({message: "Рецепт успешно добавлен"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Ошибка во время добавления рецепта'});
        }
    }

    async getRecipes(req, res) {
        const {_limit = 10, _page = 1} = req.query
        try {
            const recipes = await Recipe.find()
                .skip((_page - 1) * _limit)
                .limit(_limit);
            const totalCount = await Recipe.countDocuments();
            return res.json({recipes, totalCount});
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении рецептов" });
        }
    }

    async getRecipe(req, res) {
        const { id } = req.params;
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }

            const user = req.user;
            const isRecipeInHistory = user.history.some(historyItem => historyItem.id.toString() === recipe._id.toString());

            if (isRecipeInHistory) {
                user.history = user.history.filter((item) => item.id.toString() !== id);
            } else {
                recipe.views += 1;
                await recipe.save();
            }
            user.history.push({ id: id });
            await user.save();

            return res.json(recipe);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении рецепта" });
        }
    }

    async getRecipeWithoutView(req, res) {
        const { id } = req.params;
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }

            return res.json(recipe);
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

    async rateRecipe(req, res) {
        const { id } = req.params;
        const { rate } = req.body;
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({ message: "Рецепт не найден" });
            }

            const user = req.user;

            const isRecipeInRated = user.rated.some(rateItem => rateItem.id.toString() === recipe._id.toString());

            if (isRecipeInRated) {
                const oldRate = user.rated.find(rateItem => rateItem.id.toString() === id).rate;
                recipe.ratingSum -= oldRate;
                user.rated = user.rated.filter((item) => item.id.toString() !== id);
            } else {
                recipe.ratingVotes += 1;
            }

            recipe.ratingSum += rate;
            user.rated.push({ id: id, rate: rate });

            await recipe.save();
            await user.save();

            return res.json({ message: "Рецепт успешно обновлен" });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении рецепта" });
        }
    }
}

module.exports = new recipeController()