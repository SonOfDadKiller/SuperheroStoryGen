import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [heroName, setHeroInput] = useState("");
    const [villainName, setVillainInput] = useState("");
    const [loveInterestName, setLoveInterestInput] = useState("");
    const [location, setLocationInput] = useState("");
    const [theme, setThemeInput] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ heroName: heroName, villainName: villainName, loveInterestName: loveInterestName, location: location, theme: theme }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setHeroInput("");
            setVillainInput("");
            setLoveInterestInput("");
            setLocationInput("");
            setThemeInput("");
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <Head>
                <title>OpenAI Quickstart</title>
                <link rel="icon" href="/dog.png" />
            </Head>

            <main className={styles.main}>
                <img src="/dog.png" className={styles.icon} />
                <h3>Superhero Story Generator</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="heroName"
                        placeholder="Enter a Hero"
                        value={heroName}
                        onChange={(e) => setHeroInput(e.target.value)}
                    />
                    <input
                        type="text"
                        name="villain"
                        placeholder="Enter a Villain"
                        value={villainName}
                        onChange={(e) => setVillainInput(e.target.value)}
                    />
                    <input
                        type="text"
                        name="loveInterest"
                        placeholder="Enter a Love Interest"
                        value={loveInterestName}
                        onChange={(e) => setLoveInterestInput(e.target.value)}
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Enter a Location"
                        value={location}
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <input
                        type="text"
                        name="theme"
                        placeholder="Enter a Theme"
                        value={theme}
                        onChange={(e) => setThemeInput(e.target.value)}
                    />
                    <input type="submit" value="Generate names" />
                </form>
                <div className={styles.result}>{result}</div>
            </main>
        </div>
    );
}
