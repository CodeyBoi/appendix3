type Option = {
  id: number;
  name: string;
};
type VotationProps = {
  votation: {
    id: number;
    endsAt: Date;
    options: Option[];
  };
};

const Votation = async ({ votation }: VotationProps) => {
  return <div>VOTATION</div>;
};

export default Votation;
