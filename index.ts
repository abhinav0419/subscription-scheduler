import { app } from "./express";
import { createServer, proxy } from "aws-serverless-express";
const server = createServer(app);
import { Context, APIGatewayEvent } from "aws-lambda";

const handler = (event: APIGatewayEvent, context: Context) => {
  proxy(server, event, context);
};

export { handler };
