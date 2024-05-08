const db = require("../Models");
const Item = db.items;

const jwt = require("jsonwebtoken");
const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);
const multer = require('multer');
const upload = multer();
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
        console.log(req.body);
        if (!name || !description) {
            return res.status(400).json({ error: description });
        }

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);
        const userId = decoded.id;
        const photos = [];

        const files = req.files;

        for (const key in files) {
            const file = files[key];
            const blobName = `${userId}_${file.originalname}`;
            const blobClient = containerClient.getBlockBlobClient(blobName);

            await blobClient.uploadData(file.buffer);

            const blobUrl = blobClient.url;
            photos.push(blobUrl);
        }

        const newItem = await Item.create({
            name,
            description,
            photos,
            userId
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Помилка при створенні елементу:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateItem = async (req, res) => {
    const itemId = req.params.itemId;
    const { name, description } = req.body;

    try {
        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        item.name = name;
        item.description = description;

        await item.save();

        res.json(item); // Respond with the updated item
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllItems,
    createItem,
    getCurrentUserItems,
    deleteItem,
    getPhoto,
    updateItem,
};