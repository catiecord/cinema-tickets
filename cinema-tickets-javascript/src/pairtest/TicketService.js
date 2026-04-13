import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  constructor(
    ticketPaymentService = new TicketPaymentService(),
    seatReservationService = new SeatReservationService()
  ) {
    this.ticketPaymentService = ticketPaymentService;
    this.seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException('Invalid account id');
    };

    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('No ticket requests provided');
    };

    ticketTypeRequests.forEach((ticketTypeRequest) => {
      if (ticketTypeRequest.getNoOfTickets() <= 0) {
        throw new InvalidPurchaseException('Invalid ticket quantity');
      }
    });

    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    ticketTypeRequests.forEach((request) => {
      const type = request.getTicketType();
      const quantity = request.getNoOfTickets();

      if (type === 'ADULT') adultCount += quantity;
      if (type === 'CHILD') childCount += quantity;
      if (type === 'INFANT') infantCount += quantity;
    });

    if (adultCount === 0 && (childCount > 0 || infantCount > 0)) {
      throw new InvalidPurchaseException('Child and infant tickets require an adult');
    };

    const totalTickets = adultCount + childCount + infantCount;

    if (totalTickets > 25) {
       throw new InvalidPurchaseException('Cannot purchase more than 25 tickets');
      };
    if (infantCount > adultCount) {
      throw new InvalidPurchaseException('Infant tickets cannot exceed adult tickets');
    };
    const totalAmount = (adultCount * 25) + (childCount * 15);
    this.ticketPaymentService.makePayment(accountId, totalAmount);
    
    const totalSeats = adultCount;
    this.seatReservationService.reserveSeat(accountId, totalSeats);
  };
};
