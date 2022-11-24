const Image = require("../models/Image");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (caption) => {
	try {

        // Create an image via the openai dall-e api
        const response = await openai.createImage({
            prompt: caption,
            n: 1,
            size: "256x256",
            response_format: "b64_json"
        });
        var base64image = response.data.data[0].b64_json;

        // Convert the output b64 to a buffer because this is used in the Image module
        var buffer = Buffer.from(base64image, 'base64');  

        // Create a image object and return it
        return imageObject = {
            file: {
                data: buffer,
                contentType: "image/png"
            },
            fileName: "defaultProfilepicture"
        };
	} catch (error) {
		console.log("Something went wrong generation image!");
		if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } 
        else {
            console.log(error.message);
        }
        return;
	}
};

