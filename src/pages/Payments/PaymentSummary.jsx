import TicketListing from "../../components/tickets/TicketListing";
import TicketFilter from "../../components/tickets/TicketFilter";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tickets",
  },
];

const PaymentSummary = () => {
  return (
    <>
      <TicketFilter />
      <TicketListing />
    </>
  );
};

export default PaymentSummary;
