import { cache } from "react";

import { createQueryClient } from "./query-client";

export const getQueryClient = cache(() => createQueryClient());
