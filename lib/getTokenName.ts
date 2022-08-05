// Call Solanafm's endpoint to retrieve token name, symbol, etc
export async function getTokenName(mintName: String): Promise<any> {
  const url = "https://hyper.solana.fm/v2/search/tokens/" + mintName;
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {},
    });
    const result = await response.json();
    // Return tokens name, abbreviation, network, hash, etc
    return result.Tokens[0];
  } catch (error) {
    console.log(error);
  }
}
