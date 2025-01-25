// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const handler = async(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
)=> {
  try{

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
   const response = await fetch(`${baseUrl}/countries`)
   const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(`ERROR: Something went wrong URL`, err);
    res.status(500).json({ name: "ERROR" });
  }
}
export default handler;

