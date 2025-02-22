const express = require("express");
const axios = require("axios");
const app = express();

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "YOUR_REDIRECT_URI";

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("認証エラー");

    try {
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
        }));

        const accessToken = tokenResponse.data.access_token;

        // ユーザー情報を取得
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.send(`ようこそ, ${userResponse.data.username}!`);
    } catch (error) {
        console.error(error);
        res.send("認証に失敗しました");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
