import Link from "next/link";
const Dashboard = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
    <Link href={`/contracts/${id}`} key={id}>{`Contract Id: ${id}`}</Link>
  ));
};
export default Dashboard;
