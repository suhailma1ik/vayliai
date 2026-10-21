import {
  serve,
  body,
  admin,
  json,
  rate,
  Failure,
  check,
} from "../_shared/http.ts";
import { device } from "../_shared/device.ts";
import { validateUsage } from "../../../src/lib/service.ts";
serve(async (req) => {
  const d = await device(req);
  await rate("usage:" + d.account_id, 600, 60);
  let metadata;
  try {
    metadata = validateUsage(await body(req));
  } catch {
    throw new Failure(
      400,
      "Invalid usage metadata. Only documented metadata fields are accepted.",
    );
  }
  const result = await admin().rpc("accept_usage", {
    p_account: d.account_id,
    p_device: d.id,
    p_event: metadata,
  });
  check(result);
  return json(result.data);
});
