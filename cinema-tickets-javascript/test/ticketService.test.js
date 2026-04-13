import { describe, it, expect, jest } from '@jest/globals';
import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketService', () => {
  describe('purchaseTickets - validation', () => {
    it('throws error when account id is less than 1', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          0,
          new TicketTypeRequest('ADULT', 1),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('throws error when no ticket requests are provided', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(1);
        }).toThrow(InvalidPurchaseException);
    });
    it('throws error when ticket quantity is zero', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', 0),
        );
      }).toThrow(InvalidPurchaseException);
  });
    it('throws error when ticket quantity is negative', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', -1),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('throws error when child tickets are purchased without an adult', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('CHILD', 1),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('throws error when infant tickets are purchased without an adult', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('INFANT', 1),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('throws error when more than 25 tickets are purchased', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', 26),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('does not throw error when 25 tickets are purchased', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', 25),
        );
      }).not.toThrow();
    });
    it('throws error when there are more infants than adults', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', 1),
          new TicketTypeRequest('INFANT', 2),
        );
      }).toThrow(InvalidPurchaseException);
    });
    it('does not throw error when infants equal adults', () => {
      const ticketService = new TicketService();

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('ADULT', 2),
          new TicketTypeRequest('INFANT', 2),
        );
      }).not.toThrow();
    });
    it('does not call payment or seat services when purchase is invalid', () => {
      const paymentService = {
        makePayment: jest.fn(),
      };

      const seatReservationService = {
        reserveSeat: jest.fn(),
      };

      const ticketService = new TicketService(paymentService, seatReservationService);

      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest('CHILD', 1), // invalid (no adult)
        );
      }).toThrow(InvalidPurchaseException);

      expect(paymentService.makePayment).not.toHaveBeenCalled();
      expect(seatReservationService.reserveSeat).not.toHaveBeenCalled();
    });
  });
  describe('purchaseTickets - payments', () => {
    it('charges £25 for 1 adult ticket', () => {
      const paymentService = {
        makePayment: jest.fn(),
      };

      const seatReservationService = {
        reserveSeat: jest.fn(),
      };

      const ticketService = new TicketService(paymentService, seatReservationService);

      ticketService.purchaseTickets(
        1,
        new TicketTypeRequest('ADULT', 1),
      );

      expect(paymentService.makePayment).toHaveBeenCalledWith(1, 25);
    });
  });
});
