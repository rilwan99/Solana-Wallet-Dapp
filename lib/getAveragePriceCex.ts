export async function getAveragePriceCex(
  userApiKey: string,
  userApiSecret: string
) {
  try {
    const url = "http://127.0.0.1:5000/ftx";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error in getAveragePriceCex.ts:" + err);
  }
}
