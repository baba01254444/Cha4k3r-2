export default async function handler(req, res) {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ error: { message: "Token is required." } });
  }

  try {
    const userInfoRes = await fetch(`https://graph.facebook.com/me?access_token=${access_token}`);
    const userInfo = await userInfoRes.json();

    if (userInfo.error) {
      return res.status(200).json({ error: userInfo.error });
    }

    const isPageToken = !!userInfo.category;
    const type = isPageToken ? "Page" : "User";

    const convoRes = await fetch(`https://graph.facebook.com/v18.0/me/conversations?fields=participants&access_token=${access_token}`);
    const convoData = await convoRes.json();

    const conversations = convoData.data?.map(c => {
      const name = c.participants?.data?.[0]?.name || "Unknown";
      const id = c.id;
      return { name, id };
    }) || [];

    return res.status(200).json({
      id: userInfo.id,
      name: userInfo.name || "Unknown",
      type,
      conversations
    });
  } catch (error) {
    return res.status(500).json({ error: { message: "Internal server error." } });
  }
}
