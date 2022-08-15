export async function getAveragePriceDex(wallet: string) {
  try {
    const url = "http://127.0.0.1:5000/phantom";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error in getAveragePricDex.ts:" + err);
  }
}
