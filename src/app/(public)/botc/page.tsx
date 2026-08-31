import BloodOnTheClocktowerElement from './blood-on-the-clocktower';

const BloodOnTheClocktowerPage = () => {
  return (
    <BloodOnTheClocktowerElement baseUrl={process.env.NEXTAUTH_URL ?? ''} />
  );
};

export default BloodOnTheClocktowerPage;
