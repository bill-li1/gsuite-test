// pages/api/drive.ts

import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";
import { google } from "googleapis";

const auth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  console.log("here?");
  if (!session) {
    throw new Error("Unauthorized");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  return auth;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  console.log("req", req);

  try {
    const authClient = await auth(req);
    const drive = google.drive({ version: "v3", auth: authClient });
    console.log("running here?");
    const { fileId } = req.query;

    switch (method) {
      case "GET":
        if (!fileId) {
          const response = await drive.files.list();
          return res.status(200).json(response.data);
        }

        const metadata = await drive.files.get({ fileId: fileId as string });
        return res.status(200).json(metadata.data);

      case "POST":
        if (!fileId) {
          return res.status(400).json({ error: "File ID is required" });
        }

        const file = await drive.files.export({
          fileId: fileId,
          alt: "media",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        return res.status(200).send(file.data);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
