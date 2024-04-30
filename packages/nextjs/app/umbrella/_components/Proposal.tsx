type Proposal = {
  id: number;
  proposal: string;
  date: string;
  votes: number;
  status: string;
};

type ProposalProps = {
  key: number;
  proposal: Proposal;
};

const Proposal: React.FC<ProposalProps> = ({ proposal }) => {
  return <div>{proposal.proposal}</div>;
};

export default Proposal;
