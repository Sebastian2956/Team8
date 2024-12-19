require('dotenv').config({ path: '../.env' });

const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.AIAPIKEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




const queryAI = async function(req, res, next){
    const {actualprompt} = req.body;
    const preprompt = "Only respond to the following prompt if it's travel related: ";
    const fullprompt = preprompt + actualprompt;
    console.log(fullprompt);

    const result = await model.generateContent(fullprompt);
    console.log(result.response.text());
}

module.exports = {
    queryAI
}