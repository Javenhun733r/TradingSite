const db = require("../Models");
const Item = db.items;
const multer = require('multer');
const jwt = require("jsonwebtoken");
const path = require("path");

const getPhoto = async (req, res) =>{
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'public/uploads', filename);
    res.sendFile(imagePath);
}
const getAllItems = async (req, res) => {
    try {
        const posts = await Item.findAll();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getCurrentUserItems = async (req,res)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const userItems = await Item.findAll({where: {userId}});
        res.json(userItems);
    }
    catch (error){
        console.error("Помилка під час отримання списку товарів користувача: ", error);
        res.status(500).json({error: 'Помилка на сервері'});
    }
}
const deleteItem = async (req,res)=>
{
    const itemId = req.params.itemId;

    try {
        // Знайдіть елемент за його ідентифікатором та видаліть його
        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await item.destroy(); // Видалити елемент з бази даних
        res.status(204).end(); // Відповісти успішно, без вмісту
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const createItem = async (req, res) => {
    try {
        const { name, description } = req.body;
        const token = req.body.jwt;
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const photos = [];

        // Перевірка наявності файлів у запиті
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '../uploads/' + file.filename);
                photos.push(filePath); // Додавання шляху до файлу у масив
            });
        } else if (req.files) {
            // Якщо переданий лише один файл, обробити його як масив з одним елементом
            const filePath = '/uploads/' + req.files.filename;
            photos.push(filePath); // Додавання шляху до файлу у масив
        }

        // Створення нового елемента у базі даних
        const newItem = await Item.create({
            name,
            description,
            photos,
            userId
        });

        res.status(201).json(newItem); // Відповідь з новим елементом
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllItems,
    createItem,
    getCurrentUserItems,
    deleteItem,
    getPhoto,
};