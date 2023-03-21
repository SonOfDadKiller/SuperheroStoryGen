import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message:
                    "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    const heroName = req.body.heroName;
    const villainName = req.body.villainName;
    const location = req.body.location;
    const loveInterest = req.body.loveInterestName;
    const theme = req.body.theme;

    const generatedHeroName = await generateName(heroName, "superhero");
    const generatedVillainName = await generateName(villainName, "supervillain");
    const generatedCityName = await generateCity(location);
    //const generatedLoveInterestName = await generateLoveInterestName(loveInterest);
    const generatedTheme = await generateTheme(theme);

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(
                generatedHeroName,
                generatedVillainName,
                generatedCityName,
                loveInterest,
                generatedTheme
            ),
            temperature: 0.6,
            max_tokens: 1000,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}

async function generateName(name, role) {
    const prompt = `Generate a ${role} name based on the input '${name}'`;

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 50,
        });

        const newName = completion.data.choices[0].text.trim();

        return newName;
    } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error("Failed to generate name");
    }
}

async function generateCity(name) {
    const prompt = `Generate a futuristic metropolis name based on the input '${name}'`;

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 50,
        });

        const newName = completion.data.choices[0].text.trim();

        return newName;
    } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error("Failed to generate city name");
    }
}

// async function generateLoveInterestName(name) {
//     const prompt = `Generate the name of a love interest for a superhero story based on the input '${name}'`;

//     try {
//         const completion = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt: prompt,
//             temperature: 0.6,
//             max_tokens: 50,
//         });

//         const newName = completion.data.choices[0].text.trim();

//         return newName;
//     } catch (error) {
//         console.error(`Error with OpenAI API request: ${error.message}`);
//         throw new Error("Failed to generate city name");
//     }
// }

async function generateTheme(name) {
    const prompt = `Finish the sentence: ${name} is...`;

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 50,
        });

        const newName = completion.data.choices[0].text.trim();

        return newName;
    } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error("Failed to generate city name");
    }
}

function generatePrompt(heroName, villainName, cityName, loveInterest, theme) {
    let string = `Write me a story with the theme of 'an unplanned and unexpected but fortunate discovery or occurrence, typically when searching for something else entirely, and ${theme}' about a superhero named ${heroName} who battles an evil villain named ${villainName} in the futuristic metropolis of ${cityName} to save his/her love interest ${loveInterest}`;
    console.log(string);
    return string;
}