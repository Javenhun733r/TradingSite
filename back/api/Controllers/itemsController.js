const db = require("../Models");
const Item = db.items;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const getAllItems = async (req, res) => {
    try {
        const posts = await Item.findAll();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const createItem = async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        const photos = []; // Масив для збереження шляхів до зображень

        // Отримуємо файли зображень, які були завантажені на сервер
        req.files.forEach(file => {
            // Зберігаємо зображення на сервері, наприклад, у папці 'uploads'
            const filePath = '/uploads/' + file.filename;
            photos.push(filePath); // Додаємо шлях до зображення у масив
        });

        // Створюємо новий елемент в базі даних зі збереженими шляхами до зображень
        const newItem = await Item.create({
            name,
            description,
            photos, // Зберігаємо лише шляхи до зображень у базі даних
            userId
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllItems,
    createItem,
};