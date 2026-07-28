import { redirect } from 'next/navigation';

interface AdminViewGigsProps {
  currentYear?: number;
}

const AdminViewGigs = ({
  currentYear = new Date().getFullYear(),
}: AdminViewGigsProps) => {
  redirect(`/gigs?year=${currentYear}&tab=all`);
};

export default AdminViewGigs;
