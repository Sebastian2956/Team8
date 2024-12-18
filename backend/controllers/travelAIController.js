require('dotenv').config({ path: '../.env' });

const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.AIAPIKEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




async function queryAI(){
    const prompt = "Explain how AI works";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

module.exports = {
    queryAI
}