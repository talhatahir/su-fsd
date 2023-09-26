/** @format */

import path from "path";
import csv from "csv-parser";
import fs from "fs";

export default async function handler(req, res) {
  const directory = path.join(process.cwd(), "data.csv");

  const results = [];

  fs.createReadStream(directory)
    .pipe(csv({ separator: ";", headers: ["created", "filename"] }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
      res.status(200).json(results);
    });
}
