export async function getTokenPrices(symbols: string[]): Promise<number[]> {
  let tokenSymbols: string[] = [];
  symbols.forEach((e) => tokenSymbols.push(e.toLowerCase()));
  let tokenPrices: number[] = [];

  // Import coingecko-api
  const CoinGecko = require("coingecko-api");

  // Initiate the CoinGecko API Client
  const CoinGeckoClient = new CoinGecko();

  // Retrieving list of all supported coins id, name and symbol
  const data = await CoinGeckoClient.coins.list();

  // Returns array of objects with properties: id, name & symbol
  const coingeckoList = data.data;

  for (let i = 0; i < tokenSymbols.length; i++) {
    // Filtering through array to find the desired token
    const requiredTokenObject = coingeckoList.find(
      (element) => element.symbol === tokenSymbols[i]
    );
    console.log(requiredTokenObject);

    // Finding the coingecko ID of the desired token
    const requiredTokenId = requiredTokenObject.id;
    // console.log(requiredTokenId);

    // Fetching token information using coingecko API
    const tokenInfo = await CoinGeckoClient.coins.fetch(requiredTokenId, {
      tickers: false,
      community_data: false,
      developer_data: false,
      localization: false,
    });
    // Retrieving market data of the desired token
    const priceInfo = tokenInfo.data.market_data;

    // Fetching Price(USD) of the desired token
    const priceInfoUsd = priceInfo.current_price.usd;
    // console.log(JSON.stringify(priceInfoUsd));
    // console.log(priceInfoUsd);

    tokenPrices.push(priceInfoUsd);
  }
  return tokenPrices;
}
