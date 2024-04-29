import Proposal from "./Proposal";

type UmbrellaVotingProps = {
  address?: string;
};

/**
 *
 * @param address - The address of the connected account
 * @returns a component that allows the user to vote on proposals, create new proposals, and see their votes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UmbrellaVoting: React.FC<UmbrellaVotingProps> = ({ address }) => {
  const proposals = [
    {
      id: 1,
      proposal: "Proposal 1",
      date: "2021-10-01",
      votes: 100,
      status: "Active",
    },
    {
      id: 2,
      proposal: "Proposal 2",
      date: "2021-10-02",
      votes: 200,
      status: "Active",
    },
    {
      id: 3,
      proposal: "Proposal 3",
      date: "2021-10-03",
      votes: 300,
      status: "Active",
    },
  ];

  return (
    <div className="bg-blue-900 p-10 rounded-xl col-start-2 col-end-4 row-start-2 row-end-3 flex flex-col">
      <h2 className="text-xl">
        Proposals & Voting <span className="d italic">(coming soon)</span>
      </h2>
      <div className="blur-sm">
        <p className="text-sm">Vote on proposals that you prefer.</p>
        <div className="mt-8 flex flex-col gap-4 bg-slate-800 rounded-xl p-4 flex-1">
          <h3>Proposals</h3>
          <ul className="flex flex-col justify-center items-center gap-2 overflow-y-auto">
            {proposals.map((proposal, id) => (
              <li key={id} className={`${id % 2 == 0 ? "bg-slate-600" : "bg-slate-700"} w-full p-2`}>
                <Proposal key={id} proposal={proposal} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* TODO: Add account balance */}
      {/* TODO: Show current proposals */}
      {/* TODO: Create new proposal */}
      {/* TODO: Vote */}
      {/* TODO: See your votes */}
    </>
  );
};

export default UmbrellaVoting;
