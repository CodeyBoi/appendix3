import { redirect } from 'next/navigation';

const AdminViewGigs = () => {
  const currentYear = new Date().getFullYear();
  redirect(`/gigs?year=${currentYear}&tab=all`);
};

export default AdminViewGigs;
