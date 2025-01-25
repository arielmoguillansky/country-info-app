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
    const parsedRequest = JSON.parse(req.body)
    
    const response = await fetch(`${baseUrl}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: parsedRequest?.countryId }),
    })

    console.log(response);

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(`ERROR: Something went wrong URL`, err);
    res.status(500).json({ name: "ERROR" });
  }
}
export default handler;

