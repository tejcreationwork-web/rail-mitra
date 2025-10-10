export async function fetchPNRStatus(pnrNumber: string) {
  const url = `https://irctc1.p.rapidapi.com/api/v3/getPNRStatus?pnrNumber=${pnrNumber}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '0d29b06655mshc30c30b21056431p1d7fa2jsn01cb16cb3f6f',
      'x-rapidapi-host': 'irctc1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // directly parse JSON
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch PNR status");
  }
}

export async function fetchLiveTrainStatus(trainNumber: string, startDay: string) {
  const url = `https://fastapi-backend-production-23ac.up.railway.app/irctc/live_train_status/${trainNumber}?startDay=${startDay}`;
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch live train status");
  }
}
