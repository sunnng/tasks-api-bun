import type { ErrorHandler, NotFoundHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { OpenAPIHono } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASES } from "stoker/http-status-phrases";

const app = new OpenAPIHono();

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: `not found ${NOT_FOUND_PHRASES}`,
    NOT_FOUND,
  });
};

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;

  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;

  console.log(currentStatus, statusCode);
  return c.json({
    err: err.message,
    statusCode,
  });
};

// 404 handler
app.notFound(notFound);

// error handler
app.onError(onError);

app.get("/", (c) => {
  return c.text("Hello Zod Open API Hono!");
});

app.get("/error", (c) => {
  throw new Error("oh no!");
});

const port = 3000;

// eslint-disable-next-line no-console
console.log(`Server is running on ${port}`);

export default {
  port,
  fetch: app.fetch,
};
