export type SavedPNR = {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  sourceDoj: string;
  destinationDoj: string;
  journeyClass: string;
  boardingPoint: string;
  reservationUpto : string;
  arrivalTime: string;
  departureTime: string;
  expectedPlatformNumber : number | string;
  ticketFare : number;
  hasPantry : boolean;
  bookingDate : string;
  quota : string;
  coachPosition : string;
  passengerCount : number;
  chartPrepared : boolean;
  passengers: {
    number: string;
    age?: number;
    status: string;
    coach: string;
    berth: string | number;
    seat: number | string;
  }[];
  lastChecked: string;
  savedAt: string;
  isRefreshing?: boolean;
};

export type APIResponse = {
  status: boolean;
  message: string;
  timestamp: number;
  data?: {
    Pnr: string;
    TrainNo: string;
    TrainName: string;
    SourceDoj: string;
    DestinationDoj : string;
    Class: string;
    ReservationUpto: string;
    BoardingPoint: string;
    ArrivalTime: string;
    DepartureTime: string;
    ChartPrepared : boolean;
    PassengerStatus: {
      BookingStatus?: string;
      CurrentStatus?: string;
      BookingCoachId?: string;
      CurrentCoachId?: string;
      CurrentStatusNew?: string;
      BookingStatusNew?: string;
      BookingBerthCode?: string;
      CurrentBerthCode?: string;
      BookingBerthNo?: string;
      CurrentBerthNo?: string;
    }[];
  };
};

export interface BookingCardProps {
  booking: SavedPNR;
  expandedPNRs: Set<string>;
  toggleExpanded: (pnrId: string) => void;
  formatStatus: (status: string) => string;
  getStatusColor: (status: string) => string;
  nextJourneyPNR: string | null;
  handleMarkNextJourney: (booking: SavedPNR) => Promise<void>;
  handleRefreshPNR: (pnrId: string) => Promise<void>;
  handleDeletePNR: (pnrId: string) => Promise<void>;
}
