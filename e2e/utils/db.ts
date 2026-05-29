import { Client } from "pg";

export async function getDbClient() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();
  return client;
}

export async function waitForAssignmentInDb(
  clientPhone: string,
  retries = 10,
  delayMs = 1000,
) {
  const db = await getDbClient();

  try {
    for (let i = 0; i < retries; i++) {
      const result = await db.query(
        `
        SELECT
          client_phone,
          manager_login,
          is_active,
          assigned_at,
          unassigned_at,
          to_char(assigned_at, 'YYYY-MM-DD HH24:MI:SS.MS') ||
          ' ' ||
          replace(to_char(assigned_at, 'TZH:TZM'), ':', '') as assigned_at_formatted,
          CASE
            WHEN unassigned_at IS NOT NULL THEN
              to_char(unassigned_at, 'YYYY-MM-DD HH24:MI:SS.MS') ||
              ' ' ||
              replace(to_char(unassigned_at, 'TZH:TZM'), ':', '')
            ELSE NULL
          END as unassigned_at_formatted
        FROM assignments
        WHERE client_phone = $1
        ORDER BY id DESC
        LIMIT 1
        `,
        [clientPhone],
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return null;
  } finally {
    await db.end();
  }
}
