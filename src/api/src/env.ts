import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import * as dotenv from 'dotenv';


dotenv.config();
dotenv.config({
    path: '.env.local',
})

// console.log(process.env);

export const env = createEnv({
    clientPrefix: "PUBLIC_",
    server: {
        PORT: z.coerce.number().default(3080),
        HOSTNAME: z.string().default('localhost'),
        NODE_ENV: z.enum(['production', 'development']).default('development'),
        // DATABASE_URL: z.string().url(),
        // OPEN_AI_API_KEY: z.string().min(1),
        // S3_ACCESS_KEY_ID: z.string(),
        // S3_ACCESS_KEY_SECRET: z.string(),
    },
    client: {
        // PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    },
    runtimeEnv: process.env, // or `import.meta.env`, or similar
});
