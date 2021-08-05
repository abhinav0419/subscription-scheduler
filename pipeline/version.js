const fs = require("fs");

let prod = JSON.parse(fs.readFileSync("./pipeline/prod-config.json"));
prod.Parameters.CodebuildId = process.env.CODEBUILD_BUILD_NUMBER

fs.writeFileSync("./pipeline/prod-config.json",JSON.stringify(prod,null,2))
