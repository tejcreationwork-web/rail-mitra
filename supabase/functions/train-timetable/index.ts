const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface TrainRequest {
  trainNoCc: string;
  category: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const { trainNoCc, category }: TrainRequest = await req.json();

    if (!trainNoCc || !category) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Pad train number with spaces to match expected format
    const paddedTrainNo = trainNoCc.padEnd(15, ' ');
    
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Origin", "https://wps.konkanrailway.com");
    myHeaders.append("Referer", "https://wps.konkanrailway.com/Website_TrnSch/trainschedule");

    const raw = JSON.stringify({
      "trainNoCc": paddedTrainNo,
      "category": category
    });

    const response = await fetch('https://wps.konkanrailway.com/trnschwar/trainschedule/loadTrainDetailList', {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    
    // Try to parse as JSON, if it fails return the text response
    let data;
    try {
      data = JSON.parse(result);
    } catch (parseError) {
      // If it's not JSON, return the text response
      data = { rawResponse: result };
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in train-timetable function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});