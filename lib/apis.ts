export async function fetchPNRStatus(pnr: string) {
  try {
    const response = await fetch(
      `https://fastapi-backend-production-23ac.up.railway.app/irctc/pnr_checker/${pnr}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    return data; // { status, message, timestamp, data }
  } catch (error) {
    console.error('Error fetching PNR status:', error);
    throw error;
  }
}
