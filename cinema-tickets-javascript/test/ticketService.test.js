import { describe, it, expect } from '@jest/globals';
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
  });
});
