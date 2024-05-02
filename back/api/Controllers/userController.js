const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const User = db.users;

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const data = {
            username,
            email,
            password: await bcrypt.hash(password, 10),
        };
        const user = await User.create(data);
        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

            return res.status(201).send(token);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        console.log(error);
    }
};


const getUserName = async (req,res) =>{
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send("Token not provided");
        }
        const decoded = jwt.verify(token, process.env.secretKey);

        const userId = decoded.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }


        return res.status(200).send(user.username);
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

                return res.status(201).send(token);
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signup,
    login,
    getUserName
};