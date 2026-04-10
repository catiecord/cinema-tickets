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
  });
});
