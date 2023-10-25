import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import VerifyRequest from './verify';

const VerifyRequestPage = async () => {
  const cookiesList = cookies();
  const unverifiedToken = cookiesList.get('unverifiedToken')?.value;
  const session = await getServerSession(authOptions);
  // Redirects to home if user is already logged in
  if (session) {
    redirect('/');
  }
  if (!unverifiedToken) {
    setTimeout(() => {
      redirect('/login');
    }, 5000);
    return (
      <div className='flex items-center justify-center h-screen polka'>
        <div className='p-4 bg-red-600 rounded shadow-2xl'>
          <h4 className='max-w-3xl text-center text-white'>
            Ditt inloggningsförsök har gått ut, du kommer nu att skickas
            tillbaka till startsidan om 5 sekunder.
          </h4>
        </div>
      </div>
    );
  }
  return <VerifyRequest unverifiedToken={unverifiedToken} />;
};

export default VerifyRequestPage;
