import { prisma } from 'server/db/client';
import BookingForm from '../form';

const BookingPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const isNewBooking = id === 'new';

  const booking = isNewBooking
    ? undefined
    : await prisma.booking.findUnique({ where: { id } });

  if (booking === null) {
    return <div>Tarmenbokning kunde ej hittas</div>;
  }

  return <BookingForm booking={booking} />;
};

export default BookingPage;
