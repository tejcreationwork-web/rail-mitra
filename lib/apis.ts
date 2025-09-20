const fetch = require('node-fetch');

export default async function fetchPNRStatus(pnrNumber: string) {
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
// responce
// {
//     "status": true,
//     "message": "Success",
//     "timestamp": 1758303698387,
//     "data": {
//         "Pnr": "8138246672",
//         "TrainNo": "12133",
//         "TrainName": "MANGALURU EXP",
//         "Doj": "19-09-2025",
//         "BookingDate": "18-09-2025",
//         "Quota": "PT",
//         "DestinationDoj": "20-09-2025",
//         "SourceDoj": "19-09-2025",
//         "From": "TNA",
//         "To": "KKW",
//         "ReservationUpto": "KKW",
//         "BoardingPoint": "TNA",
//         "Class": "3A",
//         "ChartPrepared": true,
//         "BoardingStationName": "Thane",
//         "TrainStatus": "",
//         "TrainCancelledFlag": false,
//         "ReservationUptoName": "Kankavali",
//         "PassengerCount": 1,
//         "PassengerStatus": [
//             {
//                 "ReferenceId": null,
//                 "Pnr": null,
//                 "Number": 1,
//                 "Prediction": null,
//                 "PredictionPercentage": null,
//                 "ConfirmTktStatus": null,
//                 "Coach": "B3",
//                 "Berth": 28,
//                 "BookingStatus": "CNF B3 28",
//                 "CurrentStatus": "CNF B3 28",
//                 "CoachPosition": "",
//                 "BookingBerthNo": "28",
//                 "BookingCoachId": "B3",
//                 "BookingStatusNew": "CNF",
//                 "BookingStatusIndex": "0",
//                 "CurrentBerthNo": "28",
//                 "CurrentCoachId": "B3",
//                 "BookingBerthCode": "LB",
//                 "CurrentBerthCode": "LB",
//                 "CurrentStatusNew": "CNF",
//                 "CurrentStatusIndex": "0"
//             }
//         ],
//         "DepartureTime": "22:39",
//         "ArrivalTime": "06:20",
//         "ExpectedPlatformNo": "7",
//         "BookingFare": "1260",
//         "TicketFare": "1260",
//         "CoachPosition": "L SLR UR S7 S6 S5 S4 S3 S2 S1 B4 B3 B2 B1 AB1 A1 UR SLR",
//         "Rating": 3.9,
//         "FoodRating": 3.6,
//         "PunctualityRating": 3.9,
//         "CleanlinessRating": 4.1,
//         "SourceName": "Thane",
//         "DestinationName": "Kankavali",
//         "Duration": "7:41",
//         "RatingCount": 1870,
//         "HasPantry": false,
//         "GroupingId": null,
//         "OptVikalp": false,
//         "VikalpData": "",
//         "VikalpTransferred": false,
//         "VikalpTransferredMessage": "",
//         "FromDetails": {
//             "category": "A1",
//             "division": "BB",
//             "latitude": "19.1860408",
//             "longitude": "72.9758837",
//             "state": "MAHARASHTRA",
//             "stationCode": "TNA",
//             "stationName": "THANE"
//         },
//         "BoardingPointDetails": {
//             "category": "A1",
//             "division": "BB",
//             "latitude": "19.1860408",
//             "longitude": "72.9758837",
//             "state": "MAHARASHTRA",
//             "stationCode": "TNA",
//             "stationName": "THANE"
//         }
//     }
// }
