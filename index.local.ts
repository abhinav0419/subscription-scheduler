import { app } from "./express";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
