import { API_URL } from "../../utils/baseUrl";
import Link from "next/link";

export default function Contracts(props) {
  return (
    <>
      {/* <div>{props.folder_name}</div>
      <div>{props.document_type}</div> */}
      <Link href={props.document_link || ""}>Click here to view document</Link>
    </>
  );
}

// export async function getStaticPaths() {
//   const res = await fetch(`${API_URL}document/getUserDocs`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });
//   const userDocInfo = await res?.json();
//   const paths = userDocInfo.data.map((contract) => {
//     return {
//       params: {
//         id: contract.client_id.toString(),
//       },
//     };
//   });
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }) {
//   const res = await fetch(`${API_URL}document/getUserDocs`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       folder_name: "",
//       user_id: Number(params.id),
//     }),
//   });
//   const docInfo = await res?.json();
//   return {
//     props: docInfo.data[0],
//   };
// }
